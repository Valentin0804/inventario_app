import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  rememberSession: boolean = false;
  error: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    console.log('🚀 Ejecutando login()');

    const credentials = {
      email: this.email,
      password: this.password,
      rememberSession: this.rememberSession
    };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('❌ Error al iniciar sesión:', err);
        alert(err.error?.message || 'Credenciales incorrectas');
      },
    });
  }
}
