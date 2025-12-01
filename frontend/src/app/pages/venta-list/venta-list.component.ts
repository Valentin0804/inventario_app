import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../core/services/venta.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-venta-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './venta-list.component.html',
  styleUrls: ['./venta-list.component.css'],
})
export class VentaListComponent implements OnInit {
  ventas: any[] = [];
  loading: boolean = true;

  private ventaService = inject(VentaService);
  private router = inject(Router);
  private authService = inject(AuthService);
  ngOnInit() {
    this.cargarVentas();
  }

  cargarVentas() {
    this.loading = true;

    const currentUser = this.authService.getCurrentUser();

    this.ventaService.getVenta().subscribe({
      next: (data) => {
        console.log('Todas las ventas:', data);

        // Filtro
        if (currentUser && currentUser.rol === 'dueno') {
          // Si es dueño
          this.ventas = data;
        } else if (currentUser) {
          // Si es empleado, filtra con su ID
          this.ventas = data.filter(
            (venta) => venta.usuario_id === currentUser.id
          );
        } else {
          this.ventas = [];
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando ventas:', err);
        this.loading = false;
      },
    });
  }

  eliminar(id: number) {
    const password = prompt(
      '⚠️ ELIMINAR VENTA\nEsta acción devolverá el stock a los productos.\n\nIngrese su contraseña para confirmar:'
    );

    if (!password) return;

    this.ventaService.deleteVenta(id, password).subscribe({
      next: () => {
        alert('Venta eliminada y stock restaurado correctamente.');
        this.cargarVentas(); // Recarga la tabla
      },
      error: (err) => {
        console.error(err);
        alert(
          'Error: ' +
            (err.error?.message || 'Contraseña incorrecta o error de servidor')
        );
      },
    });
  }

  editar(venta: any) {
    this.router.navigate(['/ventas/edit', venta.id]);
  }
}
