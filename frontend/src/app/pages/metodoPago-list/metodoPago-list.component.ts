import { Component, OnInit } from '@angular/core';
import {
  MetodoPagoService,
  MetodoPago,
} from '../../core/services/metodoPago.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metodoPago-list',
  templateUrl: './metodoPago-list.component.html',
  styleUrls: ['./metodoPago-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class MetodoPagoListComponent implements OnInit {
  MetodoPago: MetodoPago[] = [];

  constructor(
    private MetodoPagoService: MetodoPagoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarMetodoPago();
  }

  cargarMetodoPago() {
    this.MetodoPagoService.getMetodosPagos().subscribe((data) => {
      this.MetodoPago = data;
    });
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que deseas eliminar este proveedor?')) {
      this.MetodoPagoService.deleteMetodoPago(id).subscribe(() => {
        alert('Metodo Pago eliminado correctamente');
        this.cargarMetodoPago();
      });
    }
  }
}
