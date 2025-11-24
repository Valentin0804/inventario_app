import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService, DashboardSummary } from '../../core/services/dashboard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  // Usamos un Observable para manejar los datos de forma reactiva
  public summary$!: Observable<DashboardSummary>;

  private dashboardService = inject(DashboardService);


  ngOnInit(): void {
    // Al iniciar el componente, pedimos los datos
    this.summary$ = this.dashboardService.getSummary();
  }

  constructor(private router: Router) {}

  goToAddProduct() {
    this.router.navigate(['/producto-list']); // Ruta del componente de agregar producto
  }

  goToAddProveedor(){
    this.router.navigate(['/proveedor-list']); // Ruta del componente de agregar proveedor
  }

  goToAddCategoria(){
    this.router.navigate(['/categoria-list']); //Ruta del componente de agregar categoria
  }

  goToAddMetodoPago(){
    this.router.navigate(['/metodopago-list']); //Ruta del componente de agregar categoria
  }

  goToAddVenta(){
    this.router.navigate(['/add-venta']); //Ruta del componente de agregar categoria
  }

  goToVentas(){
    this.router.navigate(['/venta-list']); //Ruta del componente de agregar categoria
  }
}