import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'dueno' | 'empleado' | 'subcuenta' | null;
  owner_id?: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        const token = res.accessToken || res.token;

        if (!res || !token) {
          throw new Error(
            'Respuesta inválida del servidor: No se recibió token'
          );
        }

        //Normalizar el Rol
        let normalizedRole = res.role ? res.role.toLowerCase() : null;

        // Si llega con 'ñ', lo pasamos a 'n'
        if (normalizedRole === 'dueño') {
          normalizedRole = 'dueno';
        }

        const allowedRoles = ['dueno', 'empleado', 'subcuenta', 'admin'];

        let finalRole: User['rol'] | null = null;

        if (allowedRoles.includes(normalizedRole)) {
          finalRole = normalizedRole as User['rol'];
        } else {
          console.warn(
            `Rol recibido (${normalizedRole}) no está en la lista de permitidos.`
          );
        }

        const fixedUser: User = {
          id: res.id,
          nombre: res.nombre,
          email: res.email,
          rol: finalRole,
          owner_id: res.owner_id ?? null,
        };

        console.log('Usuario procesado para guardar:', fixedUser);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(fixedUser));

        this.currentUserSubject.next(fixedUser);
      })
    );
  }

  //  Obtener usuario actual
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  //  Logout
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  //  Token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  //  Roles
  isDueno(): boolean {
    return this.currentUserSubject.value?.rol === 'dueno';
  }

  isEmpleado(): boolean {
    return this.currentUserSubject.value?.rol === 'empleado';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  //  Cargar desde localStorage
  private loadUserFromStorage(): void {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) return;

    try {
      const parsed = JSON.parse(rawUser);

      const normalizedRole = parsed.rol ? parsed.rol.toLowerCase() : null;
      const allowedRoles = ['dueno', 'empleado', 'subcuenta'];
      const finalRole = allowedRoles.includes(normalizedRole)
        ? (normalizedRole as User['rol'])
        : null;

      const fixedUser: User = {
        id: parsed.id,
        nombre: parsed.nombre,
        email: parsed.email,
        rol: finalRole,
        owner_id: parsed.owner_id ?? null,
      };

      this.currentUserSubject.next(fixedUser);
    } catch (error) {
      console.error('Error cargando user del localStorage:', error);
    }
  }
}
