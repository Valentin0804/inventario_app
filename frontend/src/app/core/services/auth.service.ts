import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'dueno' | 'subcuenta' | 'empleado';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  // ---------- LOGIN ----------
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token && res.user) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  // ---------- LOGOUT ----------
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  // ---------- OBTENER TOKEN ----------
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ---------- OBTENER USUARIO ----------
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // ---------- ¿ES DUEÑO? ----------
  isDueno(): boolean {
    return this.currentUserSubject.value?.rol === 'dueno';
  }

  // ---------- ¿ES SUBCUENTA? ----------
  isSubcuenta(): boolean {
    return this.currentUserSubject.value?.rol === 'subcuenta';
  }

  // ---------- ¿ESTÁ AUTENTICADO? ----------
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ---------- CARGAR USUARIO DESDE LOCALSTORAGE ----------
  private loadUserFromStorage(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }
}
