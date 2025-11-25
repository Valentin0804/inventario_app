import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Servicios
import { ProductosService, Producto } from '../../core/services/productos.service';
import { VentaService, Venta } from '../../core/services/venta.service';
import { MetodoPagoService } from '../../core/services/metodoPago.service';
import { MercadoPagoService } from '../../core/services/mercadopago.service';

// Interfaz LOCAL para la tabla visual
interface ItemVisual {
  producto_id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-add-venta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-venta.component.html',
  styleUrls: ['./add-venta.component.css']
})
export class AddVentaComponent implements OnInit, OnDestroy {

  // Inyección de dependencias
  // Nota: Mantuve el estilo mixto (inject + constructor) para no romper tu código, 
  // pero idealmente deberías usar uno solo. Aquí prioricé que funcione.
  private productoService = inject(ProductosService);
  private metodoPagoService = inject(MetodoPagoService);
  private router = inject(Router);
  private ventaService = inject(VentaService);

  constructor(
    private mpService: MercadoPagoService,
  ) {}

  // --- VARIABLES DE MERCADO PAGO ---
  modalQR: boolean = false;
  qrBase64: string | null = null;
  externalReference: string = ''; 
  intervaloPago: any = null; // Timer para el polling

  // --- VARIABLES DEL FORMULARIO ---
  listaProductos: Producto[] = [];
  listaMetodosPago: any[] = [];
  
  productoSeleccionadoId: number | null = null;
  cantidadInput: number = 1;

  // --- VARIABLES DE LA VENTA ---
  itemsVenta: ItemVisual[] = [];
  metodoPagoId: number | null = null;
  totalCalculado: number = 0;
  metodoPagoSeleccionadoNombre: string = ''; // Para saber si es QR o Efectivo

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  ngOnDestroy() {
    this.detenerVerificacion();
  }

  // ==========================================
  // 1. CARGA DE DATOS
  // ==========================================
  cargarDatosIniciales() {
    this.productoService.getProductos().subscribe({
      next: (res) => this.listaProductos = res,
      error: (err) => console.error('Error cargando productos', err)
    });

    this.metodoPagoService.getMetodosPagos().subscribe({
      next: (res) => this.listaMetodosPago = res,
      error: (err) => console.error('Error cargando métodos de pago', err)
    });
  }

  // ==========================================
  // 2. LÓGICA DE CARRITO (Items)
  // ==========================================
  agregarProductoALista() {
    if (!this.productoSeleccionadoId) {
      alert("Seleccione un producto");
      return;
    }
    if (this.cantidadInput <= 0) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }

    // Buscamos el producto en la lista memoria (comparación laxa == por si viene string)
    const productoReal = this.listaProductos.find(p => p.id == this.productoSeleccionadoId);

    if (!productoReal) return;

    // Validación de Stock
    const cantidadEnLista = this.itemsVenta
      .filter(i => i.producto_id === productoReal.id!)
      .reduce((acc, i) => acc + i.cantidad, 0);
    
    const totalRequerido = cantidadEnLista + this.cantidadInput;

    if (productoReal.stock < totalRequerido) {
      alert(`Stock insuficiente. Tienes ${productoReal.stock} y quieres llevar ${totalRequerido}.`);
      return;
    }

    // Calcular precio (usando precio_final si existe)
    const precioVenta = productoReal.precio_final || 0; 

    // Verificar si ya existe para agrupar
    const itemExistente = this.itemsVenta.find(i => i.producto_id === productoReal.id);

    if (itemExistente) {
      itemExistente.cantidad += this.cantidadInput;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.precio_unitario;
    } else {
      this.itemsVenta.push({
        producto_id: productoReal.id!,
        nombre: productoReal.nombre,
        precio_unitario: precioVenta,
        cantidad: this.cantidadInput,
        subtotal: precioVenta * this.cantidadInput
      });
    }

    this.calcularTotalGeneral();
    
    // Resetear formulario
    this.productoSeleccionadoId = null;
    this.cantidadInput = 1;
  }

  eliminarItem(index: number) {
    this.itemsVenta.splice(index, 1);
    this.calcularTotalGeneral();
  }

  calcularTotalGeneral() {
    // reduce devuelve un número
    this.totalCalculado = this.itemsVenta.reduce((acc, item) => acc + item.subtotal, 0);
    return this.totalCalculado;
  }

  onMetodoPagoChange() {
    const metodo = this.listaMetodosPago.find(m => m.id == this.metodoPagoId);
    this.metodoPagoSeleccionadoNombre = metodo?.nombre?.toLowerCase() || '';
  }

  // ==========================================
  // 3. LÓGICA MERCADO PAGO (QR)
  // ==========================================
  generarQR() {
    // Validaciones básicas antes de generar QR
    if (this.itemsVenta.length === 0) { alert("El carrito está vacío"); return; }
    if (!this.metodoPagoId) { alert("Seleccione método de pago"); return; }

    const data = {
      total: this.calcularTotalGeneral(), // Llama a la función y obtiene el valor
      items: this.itemsVenta
    };

    this.modalQR = true; 
    this.qrBase64 = ''; // Muestra "Cargando..."

    this.mpService.generarQR(data).subscribe({
      next: (res) => {
        // 1. Guardamos referencia
        this.externalReference = res.external_reference;
        
        // 2. Generamos imagen QR con API externa
        const link = res.init_point;
        this.qrBase64 = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(link)}`;
        
        // 3. Empezamos a preguntar si pagaron
        this.iniciarVerificacionDePago();
      },
      error: (err) => {
        console.error('Error generando QR', err);
        alert('Error al conectar con Mercado Pago');
        this.modalQR = false;
      }
    });
  }

  iniciarVerificacionDePago() {
    // Evitar múltiples intervalos
    this.detenerVerificacion();

    this.intervaloPago = setInterval(() => {
      this.mpService.verificarEstadoPago(this.externalReference).subscribe({
        next: (res) => {
          if (res.pagado) {
            this.finalizarVentaExito();
          }
        },
        error: (err) => console.error("Error polling:", err)
      });
    }, 3000);
  }

  detenerVerificacion() {
    if (this.intervaloPago) {
      clearInterval(this.intervaloPago);
      this.intervaloPago = null;
    }
  }

  cerrarModal() {
    this.modalQR = false;
    this.detenerVerificacion();
  }

  // ==========================================
  // 4. GUARDADO DE VENTA (Backend)
  // ==========================================

  // Se llama AUTOMÁTICAMENTE cuando el QR es aprobado
  finalizarVentaExito() {
    this.detenerVerificacion();
    
    // IMPORTANTE: Reutilizamos la lógica de registrar venta
    // para asegurar que se guarde con el formato correcto en BD.
    this.registrarVenta(true); 
  }

  // Se llama MANUALMENTE (botón "Registrar Venta") o desde el QR
  registrarVenta(esAutomatico: boolean = false) {
    // Validaciones
    if (this.itemsVenta.length === 0) { alert("No hay productos."); return; }
    if (!this.metodoPagoId) { alert("Seleccione método de pago."); return; }

    // Armar objeto para el Backend
    const payload: Venta = {
      metodopago_id: Number(this.metodoPagoId),
      items: this.itemsVenta.map(item => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad
      }))
    };

    if(esAutomatico) {
        // Si viene del QR, avisamos antes
         alert("¡Pago Aprobado! Guardando venta en el sistema...");
    }

    this.ventaService.addVenta(payload).subscribe({
      next: (res) => {
        if(esAutomatico) {
            this.modalQR = false; // Cerramos modal solo si era QR
        }
        alert("¡Venta registrada con éxito!");
        this.router.navigate(['/venta-list']); // Cambié dashboard por venta-list según tu contexto
      },
      error: (err) => {
        console.error("Error guardando venta:", err);
        const mensaje = err.error?.message || "Ocurrió un error al guardar la venta.";
        alert(mensaje);
        // Si falló el guardado pero ya pagó (QR), no cerramos el modal
        // para que el vendedor pueda intentar guardar de nuevo o tomar nota.
      }
    });
  }
}