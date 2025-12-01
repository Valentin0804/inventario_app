import { Component, OnInit } from '@angular/core';
import {
  ProductosService,
  Producto,
} from '../../core/services/productos.service';
import { ProveedorService } from '../../core/services/proveedor.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
})
export class ProductoListComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  proveedores: any[] = [];

  // filtros
  busqueda: string = '';
  proveedorFiltro: string = '';
  ordenStock: string = '';

  constructor(
    private productosService: ProductosService,
    private proveedoresService: ProveedorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarProducto();
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.proveedoresService.getProveedores().subscribe((data) => {
      this.proveedores = data;
    });
  }

  cargarProducto() {
    this.productosService.getProductos().subscribe((data) => {
      this.productos = data;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros() {
    let filtrados = [...this.productos];

    // Búsqueda por nombre
    if (this.busqueda.trim() !== '') {
      filtrados = filtrados.filter((p) =>
        p.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }

    // Filtro por proveedor
    if (this.proveedorFiltro !== '') {
      filtrados = filtrados.filter(
        (p) => p.proveedor_id == Number(this.proveedorFiltro)
      );
    }

    // Ordenar por stock
    if (this.ordenStock === 'asc') {
      filtrados.sort((a, b) => a.stock - b.stock);
    } else if (this.ordenStock === 'desc') {
      filtrados.sort((a, b) => b.stock - a.stock);
    }

    this.productosFiltrados = filtrados;
  }

  eliminar(id: number) {
    if (confirm('¿seguro que desea eliminar este producto?')) {
      this.productosService.deleteProducto(id).subscribe(() => {
        alert('Producto eliminado correctamente');
        this.cargarProducto();
      });
    }
  }

  getClaseStock(stock: number): string {
    if (stock > 20) {
      return 'indicador-stock stock-optimo';
    } else if (stock > 5) {
      return 'indicador-stock stock-bajo';
    } else {
      return 'indicador-stock stock-critico';
    }
  }

  getNombreProveedor(id: number | undefined): string {
    if (!id) return '-';
    const prov = this.proveedores.find((p) => p.id === id);
    return prov ? prov.nombre : '-';
  }

  limpiarFiltros() {
    this.busqueda = '';
    this.proveedorFiltro = '';
    this.ordenStock = '';
    this.aplicarFiltros();
  }
}
