import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    const credentials = {
      email: this.email,
      password: this.password
    };

    this.http.post('/api/auth/login', credentials).subscribe({
      next: (response: any) => {
        console.log('Login exitoso!', response);

        localStorage.setItem('auth_token', response.accessToken);

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error en el login:', err);
        alert('Error: ' + err.error.message);
      }
    });
  }
}