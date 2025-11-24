import { Component, OnInit } from '@angular/core';
import {
  ProductosService,
  Producto,
} from '../../core/services/productos.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ProductoListComponent implements OnInit {
  productos: Producto[] = [];

  constructor(
    private productosService: ProductosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarProducto();
  }

  cargarProducto() {
    this.productosService.getProductos().subscribe((data) => {
      this.productos = data;
    });
  }

  eliminar(id: number) {
    if (confirm('¿seguro que desear eliminar esta categoria?')) {
      this.productosService.deleteProducto(id).subscribe(() => {
        alert('producto eliminada correctamente');
        this.cargarProducto();
      });
    }
  }

  // En tu componente TypeScript
  getClaseStock(stock: number): string {
    if (stock > 20) {
      return 'indicador-stock stock-optimo';
    } else if (stock > 5) {
      return 'indicador-stock stock-bajo';
    } else {
      return 'indicador-stock stock-critico';
    }
  }
}
