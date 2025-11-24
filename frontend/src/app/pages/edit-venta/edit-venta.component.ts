import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

import { ProductosService, Producto } from '../../core/services/productos.service';
import { VentaService } from '../../core/services/venta.service';
import { MetodoPagoService } from '../../core/services/metodoPago.service';

@Component({
  selector: 'app-edit-venta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-venta.component.html',
  styleUrls: ['./edit-venta.component.css'] // Puedes reusar el CSS de add-venta
})
export class EditVentaComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ventaService = inject(VentaService);
  private ProductosService = inject(ProductosService);
  private metodoPagoService = inject(MetodoPagoService);

  ventaId: number = 0;
  listaProductos: Producto[] = [];
  listaMetodosPago: any[] = [];

  // Variables Formulario
  productoSeleccionadoId: number | null = null;
  cantidadInput: number = 1;

  // Estado Venta
  itemsVenta: any[] = [];
  metodoPagoId: number | null = null;
  totalCalculado: number = 0;

  ngOnInit() {
    this.ventaId = this.route.snapshot.params['id'];
    
    // Cargar Maestros
    this.ProductosService.getProductos().subscribe(res => this.listaProductos = res);
    this.metodoPagoService.getMetodosPagos().subscribe(res => this.listaMetodosPago = res);

    // Cargar Venta a Editar
    if (this.ventaId) {
      this.cargarVentaExistente();
    }
  }

  cargarVentaExistente() {
    // Necesitamos un endpoint que traiga 1 venta por ID con sus detalles
    // Si no lo tienes en el servicio, agrégalo: getVentaById(id)
    this.ventaService.getVentaById(this.ventaId).subscribe({
      next: (venta: any) => {
        this.metodoPagoId = venta.metodopago_id;
        
        // Transformar detalles del backend a formato visual
        this.itemsVenta = venta.detalleVenta.map((d: any) => ({
          producto_id: d.producto_id,
          nombre: d.producto?.nombre || 'Producto Eliminado', // Asegurate que el backend traiga el producto
          precio_unitario: d.precio_unitario,
          cantidad: d.cantidad,
          subtotal: d.subtotal
        }));
        
        this.calcularTotalGeneral();
      },
      error: (err) => console.error(err)
    });
  }

  // --- LÓGICA DE AGREGAR/QUITAR ITEMS (Igual que AddVenta) ---
  agregarProductoALista() {
    if (!this.productoSeleccionadoId) return;
    const prod = this.listaProductos.find(p => p.id == this.productoSeleccionadoId);
    if (!prod) return;

    // Validación de stock (Simple)
    if (prod.stock < this.cantidadInput) {
      alert("Stock insuficiente (recuerda que al editar, el stock de la venta original se repondrá al guardar)");
      // Aquí la validación es truculenta porque el stock "real" incluye lo que ya compraste.
      // Por simplicidad, avisamos pero permitimos si es razonable.
    }

    const itemExistente = this.itemsVenta.find(i => i.producto_id === prod.id);
    const precio = prod.precio_final || 0;

    if (itemExistente) {
      itemExistente.cantidad += this.cantidadInput;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.precio_unitario;
    } else {
      this.itemsVenta.push({
        producto_id: prod.id,
        nombre: prod.nombre,
        precio_unitario: precio,
        cantidad: this.cantidadInput,
        subtotal: precio * this.cantidadInput
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
    this.totalCalculado = this.itemsVenta.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);
  }

  // --- GUARDAR EDICIÓN ---
  actualizarVenta() {
    if (this.itemsVenta.length === 0) return;

    // 1. Pedir Contraseña
    const password = prompt("🔒 SEGURIDAD: Ingrese su contraseña para confirmar la modificación:");
    if (!password) return;

    const payload = {
      password: password, // Enviamos la pass
      metodopago_id: this.metodoPagoId,
      items: this.itemsVenta.map(item => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad
      }))
    };

    this.ventaService.updateVenta(this.ventaId, payload).subscribe({
      next: () => {
        alert("Venta modificada correctamente.");
        this.router.navigate(['/venta-list']);
      },
      error: (err) => {
        alert("Error: " + (err.error.message || "Contraseña incorrecta"));
      }
    });
  }
}