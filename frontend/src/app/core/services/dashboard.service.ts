import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Datos que esperamos recibir
export interface DashboardSummary {
  kpis: {
    salesToday: number;
    revenueToday: number;
    revenueMonth: number; 
    averageTicket: number;
  };
  charts: {
    salesByMethod: [];
  };
  alerts: {
    lowStockProducts: any[]; // Deberías crear una interfaz de Producto aquí
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = '/api/dashboard';

  constructor(private http: HttpClient) { }

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }
}