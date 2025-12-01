import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');
  const role = localStorage.getItem('rol'); // 👈 guardamos el rol del login

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Si la ruta tiene restricción de rol (ej: 'dueño', 'empleado')
  const requiredRole = route.data?.['role'];

  if (requiredRole && role !== requiredRole) {
    // Si el rol NO coincide, lo sacamos
    router.navigate(['/forbidden']);
    return false;
  }

  return true;
};
