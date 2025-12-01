import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';

interface VentasPorMetodo {
  cantidad: number;
  total: number;
  metodoPago: {
    nombre: string;
  };
}

interface ProductoBajoStock {
  id: number;
  nombre: string;
  stock: number;
  alarma_stock?: number;
  proveedor?: {
    nombre: string;
    telefono?: string;
    email?: string;
  };
}

export interface DashboardSummary {
  kpis: {
    salesToday: number;
    revenueToday: number;
    revenueMonth: number;
    averageTicket: number;
  };
  charts: {
    salesByMethod: VentasPorMetodo[];
  };
  alerts: {
    lowStockProducts: ProductoBajoStock[];
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private router = inject(Router);

  summary: DashboardSummary = {
    kpis: {
      salesToday: 0,
      revenueToday: 0,
      revenueMonth: 0,
      averageTicket: 0,
    },
    charts: {
      salesByMethod: [],
    },
    alerts: {
      lowStockProducts: [],
    },
  };

  loading = true;

  currentUser: any;
  isDueno: boolean = false;
  isEmpleado: boolean = false;

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    console.log(
      'ROL ACTUAL (desde localStorage parsed):',
      this.currentUser?.rol
    );

    this.isDueno = this.currentUser?.rol === 'dueno';
    this.isEmpleado = this.currentUser?.rol === 'empleado';
    console.log('rol actual:', this.currentUser?.rol);
    this.cargarDashboard();
  }

  cargarDashboard() {
    this.dashboardService.getSummary().subscribe({
      next: (res: any) => {
        this.summary = res;
        this.loading = false;
        console.log('Datos Dashboard cargados:', this.summary);
      },
      error: (err) => {
        console.error('Error cargando dashboard', err);
        this.loading = false;
      },
    });
  }

  goToAddProduct() {
    this.router.navigate(['/producto-list']);
  }

  goToAddProveedor() {
    this.router.navigate(['/proveedor-list']);
  }

  goToAddCategoria() {
    this.router.navigate(['/categoria-list']);
  }

  goToAddMetodoPago() {
    this.router.navigate(['/metodopago-list']);
  }

  goToAddVenta() {
    this.router.navigate(['/add-venta']);
  }

  goToVentas() {
    this.router.navigate(['/venta-list']);
  }
  goToUsuarios() {
    this.router.navigate(['/usuario-list']);
  }

  logout(): void {
    console.log('Logout clicked - dashboard');
    this.authService.logout();
    console.log(
      'After authService.logout, token now =',
      localStorage.getItem('token')
    );
    this.router.navigate(['/login']);
  }
}
