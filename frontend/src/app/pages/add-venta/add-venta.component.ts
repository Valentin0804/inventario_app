import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Servicios
import { ProductosService, Producto } from '../../core/services/productos.service';
import { VentaService, Venta } from '../../core/services/venta.service';
import { MetodoPagoService } from '../../core/services/metodoPago.service';
import { MercadoPagoService } from '../../core/services/mercadopago.service';

// Interfaz LOCAL para la tabla visual (no es la del backend)
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
  imports: [CommonModule, FormsModule, RouterModule ],
  templateUrl: './add-venta.component.html',
  styleUrls: ['./add-venta.component.css']
})
export class AddVentaComponent implements OnInit {

  private productoService = inject(ProductosService);
  private metodoPagoService = inject(MetodoPagoService);
  private router = inject(Router);

  // USAMOS SOLO UNA VEZ EL SERVICE DE VENTA
  private ventaService = inject(VentaService);

  constructor(
    private mpService: MercadoPagoService
  ) {}



  modalQR = false;
  qrBase64: string | null = null;
  preference_id: string = '';
  estadoPago: string = 'pending';
  pollingInterval: any;

  // Listas maestras (para los <select>)
  listaProductos: Producto[] = [];
  listaMetodosPago: any[] = [];

  // Variables del formulario "Agregar Item"
  productoSeleccionadoId: number | null = null;
  cantidadInput: number = 1;

  // Estado de la Venta (Carrito temporal)
  itemsVenta: ItemVisual[] = [];
  metodoPagoId: number | null = null;
  totalCalculado: number = 0;
  metodoPagoSeleccionado: any;
  itemsSeleccionados: any;
  totalVenta: number =0;

  generarQR() {
  const data = {
    total: this.calcularTotalGeneral(),
    items: this.itemsVenta
  };

  this.modalQR = true; // Abrimos el modal mostrando "Cargando..."
  this.qrBase64 = '';  // Limpiamos QR anterior

  this.mpService.generarQR(data).subscribe({
    next: (res) => {
      const link = res.init_point;
      
      // La API externa genera la imagen por nosotros
      this.qrBase64 = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(link)}`;
    },
    error: (err) => {
      console.error('Error generando QR', err);
      alert('Error al conectar con Mercado Pago');
      this.modalQR = false;
    }
  });
}


  iniciarPolling() {
    this.pollingInterval = setInterval(() => {
      this.mpService.estadoPago(this.preference_id).subscribe(res => {
        this.estadoPago = res.status;

        if (res.status === 'approved') {
          clearInterval(this.pollingInterval);

          // GUARDAR VENTA AUTOMÁTICAMENTE
          this.guardarVenta();
        }
      });
    }, 3000); // consulta cada 3 segundos
  }

   guardarVenta() {
    const venta = {
      metodopago_id: 3, // id del metodo "Mercado Pago QR"
      items: this.itemsVenta.map(i => ({
        producto_id: i.producto_id,
        cantidad: i.cantidad
      }))
    };
    this.ventaService.addVenta(venta).subscribe(() => {
      alert("Pago confirmado y venta guardada!");

      this.modalQR = false;
      this.qrBase64 = null;
    });
  }
  cerrarModal() {
    this.modalQR = false;
    clearInterval(this.pollingInterval);
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    // 1. Cargar Productos
    this.productoService.getProductos().subscribe({
      next: (res) => this.listaProductos = res,
      error: (err) => console.error('Error cargando productos', err)
    });

    // 2. Cargar Métodos de Pago
    this.metodoPagoService.getMetodosPagos().subscribe({
      next: (res) => this.listaMetodosPago = res,
      error: (err) => console.error('Error cargando métodos de pago', err)
    });
  }

  agregarProductoALista() {
    // Validaciones iniciales
    if (!this.productoSeleccionadoId) {
      alert("Seleccione un producto");
      return;
    }
    if (this.cantidadInput <= 0) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }

    // Buscar el producto real en la lista cargada
    // Usamos '==' por si el select devuelve string y el id es number
    const productoReal = this.listaProductos.find(p => p.id == this.productoSeleccionadoId);

    if (!productoReal) return;

    // Validar Stock
    // Nota: Si ya agregaste este producto antes a la lista, deberíamos considerar esa cantidad también
    const cantidadEnLista = this.itemsVenta
      .filter(i => i.producto_id === productoReal.id!)
      .reduce((acc, i) => acc + i.cantidad, 0);
    
    const totalRequerido = cantidadEnLista + this.cantidadInput;

    if (productoReal.stock < totalRequerido) {
      alert(`Stock insuficiente. Tienes ${productoReal.stock} y quieres llevar ${totalRequerido}.`);
      return;
    }

    // Lógica de Agregado
    // Buscamos si ya existe en la tabla visual para agruparlo (opcional)
    const itemExistente = this.itemsVenta.find(i => i.producto_id === productoReal.id);

    // IMPORTANTE: Usamos precio_final (que incluye la ganancia)
    // Si tu interfaz Producto usa 'precio_final' asegúrate que no sea undefined.
    // Si no tienes precio_final en el front, usa: 
    // const precio = productoReal.precio_neto * (1 + productoReal.porcentaje_ganancia / 100);
    const precioVenta = productoReal.precio_final || 0; 

    if (itemExistente) {
      // Si ya existe, sumamos cantidad y recalculamos subtotal
      itemExistente.cantidad += this.cantidadInput;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.precio_unitario;
    } else {
      // Si no existe, creamos nueva fila
      this.itemsVenta.push({
        producto_id: productoReal.id!, // El ! asegura que no es undefined
        nombre: productoReal.nombre,
        precio_unitario: precioVenta,
        cantidad: this.cantidadInput,
        subtotal: precioVenta * this.cantidadInput
      });
    }

    // Actualizar Total General
    this.calcularTotalGeneral();

    // Resetear inputs para seguir cargando
    this.productoSeleccionadoId = null;
    this.cantidadInput = 1;
  }

  eliminarItem(index: number) {
    this.itemsVenta.splice(index, 1);
    this.calcularTotalGeneral();
  }

  calcularTotalGeneral() {
    this.totalCalculado = this.itemsVenta.reduce((acc, item) => acc + item.subtotal, 0);
  }

  registrarVenta() {
    // Validaciones finales
    if (this.itemsVenta.length === 0) {
      alert("No hay productos en la venta.");
      return;
    }
    if (!this.metodoPagoId) {
      alert("Debe seleccionar un método de pago.");
      return;
    }

    // Armar el objeto exacto que pide el Backend (SolicitudVenta)
    // Usamos map para transformar de 'ItemVisual' a simple { id, cantidad }
    const payload: Venta = {
      metodopago_id: Number(this.metodoPagoId), // Asegurar que sea número
      items: this.itemsVenta.map(item => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad
      }))
    };

    // Llamada al Servicio
    this.ventaService.addVenta(payload).subscribe({
      next: (res) => {
        console.log('Respuesta backend:', res);
        alert("¡Venta registrada con éxito!");
        this.router.navigate(['/dashboard']); // Redirigir al home o dashboard
      },
      error: (err) => {
        console.error(err);
        // Mostrar mensaje de error amigable
        const mensaje = err.error?.message || "Ocurrió un error al procesar la venta.";
        alert(mensaje);
      }
    });
  }

  onMetodoPagoChange() {
  const metodo = this.listaMetodosPago.find(m => m.id == this.metodoPagoId);

  this.metodoPagoSeleccionado = metodo?.nombre?.toLowerCase() || '';

  // Si es QR, preparar items y total
  if (this.metodoPagoSeleccionado.includes("qr")) {
    this.itemsSeleccionados = this.itemsVenta;
    this.totalVenta = this.totalCalculado;
  }
}

}