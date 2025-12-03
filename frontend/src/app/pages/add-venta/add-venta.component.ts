import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import {
  ProductosService,
  Producto,
} from '../../core/services/productos.service';
import { VentaService, Venta } from '../../core/services/venta.service';
import { MetodoPagoService } from '../../core/services/metodoPago.service';
import { MercadoPagoService } from '../../core/services/mercadopago.service';
import { AuthService } from '../../core/services/auth.service';

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
  styleUrls: ['./add-venta.component.css'],
})
export class AddVentaComponent implements OnInit, OnDestroy {
  private productoService = inject(ProductosService);
  private metodoPagoService = inject(MetodoPagoService);
  private router = inject(Router);
  private ventaService = inject(VentaService);
  private authService = inject(AuthService);

  constructor(
    private mpService: MercadoPagoService,
    private cdr: ChangeDetectorRef
  ) {}

  modalQR: boolean = false;
  qrBase64: string | null = null;
  externalReference: string = '';
  intervaloPago: any = null;

  listaProductos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  listaMetodosPago: any[] = [];
  productoSeleccionadoId: number | null = null;
  cantidadInput: number = 1;

  filtro: string = '';

  itemsVenta: ItemVisual[] = [];
  metodoPagoId: number | null = null;
  totalCalculado: number = 0;
  metodoPagoSeleccionadoNombre: string = '';
  mostrarLista: boolean = false;

  ngOnInit(): void {
    this.cargarDatosIniciales();
    document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
      if (!target.closest('.autocomplete-container')) {
        this.mostrarLista = false;
        this.cdr.detectChanges();
      }
    });

  }

  ngOnDestroy() {
    this.detenerVerificacion();
  }

  cargarDatosIniciales() {
    this.productoService.getProductos().subscribe({
      next: (res) => {
        
        this.listaProductos = res;
        this.productosFiltrados = [...res];
      },
      error: (err) => console.error('Error cargando productos', err),
    });

    this.metodoPagoService.getMetodosPagos().subscribe({
      next: (res) => 
        (this.listaMetodosPago = res),
      error: (err) => console.error('Error cargando métodos de pago', err),
    });
  }

  filtrarProductos() {
    const txt = this.filtro.toLowerCase().trim();
    this.mostrarLista = true;

    this.productosFiltrados = this.listaProductos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(txt) ||
        p.codigo_barras?.toString().includes(txt)
    );
  }

  seleccionarProducto(p: Producto) {
    this.productoSeleccionadoId = p.id!;
    this.filtro = p.nombre; // muestra en input
    this.mostrarLista = false;
  }

  agregarProductoALista() {
    if (!this.productoSeleccionadoId) {
      alert('Seleccione un producto');
      return;
    }
    if (this.cantidadInput <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }

    const productoReal = this.listaProductos.find(
      (p) => p.id == this.productoSeleccionadoId
    );

    if (!productoReal) return;

    // Stock
    const cantidadEnLista = this.itemsVenta
      .filter((i) => i.producto_id === productoReal.id!)
      .reduce((acc, i) => acc + i.cantidad, 0);

    const totalRequerido = cantidadEnLista + this.cantidadInput;

    if (productoReal.stock < totalRequerido) {
      alert(
        `Stock insuficiente. Tienes ${productoReal.stock} y quieres llevar ${totalRequerido}.`
      );
      return;
    }

    const precioVenta = productoReal.precio_final || 0;

    const itemExistente = this.itemsVenta.find(
      (i) => i.producto_id === productoReal.id
    );

    if (itemExistente) {
      itemExistente.cantidad += this.cantidadInput;
      itemExistente.subtotal =
        itemExistente.cantidad * itemExistente.precio_unitario;
    } else {
      this.itemsVenta.push({
        producto_id: productoReal.id!,
        nombre: productoReal.nombre,
        precio_unitario: precioVenta,
        cantidad: this.cantidadInput,
        subtotal: precioVenta * this.cantidadInput,
      });
    }

    this.calcularTotalGeneral();

    this.productoSeleccionadoId = null;
    this.cantidadInput = 1;
  }

  eliminarItem(index: number) {
    this.itemsVenta.splice(index, 1);
    this.calcularTotalGeneral();
  }

  calcularTotalGeneral() {
    this.totalCalculado = this.itemsVenta.reduce(
      (acc, item) => acc + item.subtotal,
      0
    );
  }

  onMetodoPagoChange() {
    const metodo = this.listaMetodosPago.find((m) => m.id == this.metodoPagoId);
    this.metodoPagoSeleccionadoNombre = metodo?.nombre?.toLowerCase() || '';
  }

  generarQR() {
    console.log('BOTÓN QR PRESIONADO');

    if (this.itemsVenta.length === 0) return alert('El carrito está vacío');
    if (!this.metodoPagoId) return alert('Seleccione método de pago');

    const data = {
      total: this.totalCalculado,
      items: this.itemsVenta,
    };

    this.modalQR = true;
    this.qrBase64 = '';

    this.mpService.generarQR(data).subscribe({
      next: (res) => {
        console.log('RESPUESTA MP:', res);

        this.externalReference = res.external_reference;
        const link = res.init_point;

        this.qrBase64 =
          'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' +
          encodeURIComponent(link);

        this.cdr.detectChanges();
        this.iniciarVerificacionDePago();
      },
      error: (err) => {
        console.error('Error generando QR', err);
        alert('Error con Mercado Pago');
        this.modalQR = false;
      },
    });
  }

  iniciarVerificacionDePago() {
    this.detenerVerificacion();

    this.intervaloPago = setInterval(() => {
      this.mpService.verificarEstadoPago(this.externalReference).subscribe({
        next: (res) => {
          if (res.pagado) {
            this.finalizarVentaExito();
          }
        },
        error: (err) => console.error('Error polling:', err),
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

  finalizarVentaExito() {
    this.detenerVerificacion();
    this.registrarVenta(true);
  }

  registrarVenta(esAutomatico: boolean = false) {
    if (this.itemsVenta.length === 0) return alert('No hay productos.');
    if (!this.metodoPagoId) return alert('Seleccione método de pago.');

    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      console.error('No hay usuario logueado');
      return;
    }

    const payload: Venta = {
      metodopago_id: Number(this.metodoPagoId),
      usuario_id: currentUser.id,
      items: this.itemsVenta.map((i) => ({
        producto_id: i.producto_id,
        cantidad: i.cantidad,
      })),
    };

    if (esAutomatico) alert('¡Pago aprobado! Guardando venta...');

    this.ventaService.addVenta(payload).subscribe({
      next: () => {
        if (esAutomatico) this.modalQR = false;
        alert('¡Venta registrada con éxito!');
        this.router.navigate(['/venta-list']);
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Error al guardar la venta.');
      },
    });
  }
}
