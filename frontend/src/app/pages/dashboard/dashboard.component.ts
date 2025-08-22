import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
}