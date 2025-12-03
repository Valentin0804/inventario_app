import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('rol'); 

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data?.['role'];

  if (requiredRole && role !== requiredRole) {
    router.navigate(['/forbidden']);
    return false;
  }

  return true;
};
