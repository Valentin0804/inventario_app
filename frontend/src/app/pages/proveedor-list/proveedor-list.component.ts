import { Component, OnInit } from '@angular/core';
import {
  ProveedorService,
  Proveedor,
} from '../../core/services/proveedor.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proveedor-list',
  templateUrl: './proveedor-list.component.html',
  styleUrls: ['./proveedor-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ProveedorListComponent implements OnInit {
  proveedores: Proveedor[] = [];

  constructor(
    private proveedorService: ProveedorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe((data) => {
      this.proveedores = data;
    });
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que deseas eliminar este proveedor?')) {
      this.proveedorService.deleteProveedor(id).subscribe(() => {
        alert('Proveedor eliminado correctamente');
        this.cargarProveedores();
      });
    }
  }
}
