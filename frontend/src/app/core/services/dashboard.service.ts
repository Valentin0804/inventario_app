import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
    lowStockProducts: any[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/api/dashboard`;
  

  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }
}
