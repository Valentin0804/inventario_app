import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../core/services/venta.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-venta-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './venta-list.component.html',
  styleUrls: ['./venta-list.component.css'],
})
export class VentaListComponent implements OnInit {

  ventas: any[] = [];
  ventasFiltradas: any[] = [];
  loading: boolean = true;
  currentUser: any;

  filtroVendedor: string = '';
  filtroMetodo: string = '';
  filtroFecha: string = '';

  vendedores: any[] = [];
  metodosPago: any[] = [];

  private ventaService = inject(VentaService);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();

    this.cargarVentas();
    this.cargarMetodosPago();
    this.cargarVendedoresSiEsDueno();
  }

  cargarVentas() {
    this.loading = true;

    const currentUser = this.authService.getCurrentUser();

    this.ventaService.getVenta().subscribe({
      next: (data) => {
        if (currentUser?.rol === 'dueno') {
          this.ventas = data;
        } else if (currentUser) {
          this.ventas = data.filter((v) => v.usuario_id === currentUser.id);
        } else {
          this.ventas = [];
        }

        this.ventasFiltradas = [...this.ventas];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  cargarVendedoresSiEsDueno() {
    const user = this.authService.getCurrentUser();
    if (!user || user?.rol !== 'dueno') return;

    this.ventaService.getVendedores().subscribe({
      next: (data) => {
        this.vendedores = data;
      }
    });
  }

  cargarMetodosPago() {
    this.ventaService.getMetodosPago().subscribe({
      next: (data) => {
        this.metodosPago = data;
      }
    });
  }

  aplicarFiltros() {
    this.ventasFiltradas = this.ventas.filter((venta) => {

      const coincideVendedor =
        this.filtroVendedor === '' ||
        venta.usuario_id == this.filtroVendedor;

      const coincideMetodo =
        this.filtroMetodo === '' ||
        venta.metodopago_id == this.filtroMetodo;

      const fechaVenta = venta.fecha?.substring(0, 10);
      const coincideFecha =
        this.filtroFecha === '' ||
        fechaVenta === this.filtroFecha;

      return coincideVendedor && coincideMetodo && coincideFecha;
    });
  }

  limpiarFiltros() {
    this.filtroVendedor = '';
    this.filtroMetodo = '';
    this.filtroFecha = '';
    this.ventasFiltradas = [...this.ventas];
  }

  eliminar(id: number) {
    const password = prompt(
      '⚠️ ELIMINAR VENTA\nEsta acción devolverá el stock.\n\nIngrese su contraseña:'
    );

    if (!password) return;

    this.ventaService.deleteVenta(id, password).subscribe({
      next: () => {
        alert('Venta eliminada.');
        this.cargarVentas();
      },
      error: (err) => {
        alert(err.error?.message || 'Error eliminando venta');
      },
    });
  }

  editar(venta: any) {
    this.router.navigate(['/ventas/edit', venta.id]);
  }
}
