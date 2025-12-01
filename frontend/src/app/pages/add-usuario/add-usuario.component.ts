import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddUsuarioComponent implements OnInit {
  usuarioForm!: FormGroup;
  editing = false;
  isSubmitting = false;
  errorMessage = '';
  usuarioId!: number;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.usuarioId = Number(this.route.snapshot.paramMap.get('id'));
    this.editing = !!this.usuarioId;

    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      rol: ['', [Validators.required]],
      password: [
        '',
        this.editing ? [] : [Validators.required, Validators.minLength(6)],
      ],
    });

    if (this.editing) {
      this.cargarUsuario();
    }
  }

  cargarUsuario(): void {
    this.usuarioService.getUsuarioById(this.usuarioId).subscribe({
      next: (usuario: any) => {
        this.usuarioForm.patchValue({
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        });
      },
      error: () => {
        this.errorMessage = 'Error cargando el usuario.';
      },
    });
  }

  guardar(): void {
    if (this.usuarioForm.invalid) return;

    this.isSubmitting = true;

    const usuarioData = this.usuarioForm.value;

    const request$ = this.editing
      ? this.usuarioService.actualizarUsuario(this.usuarioId, usuarioData)
      : this.usuarioService.createUsuario(usuarioData);

    request$.subscribe({
      next: () => this.router.navigate(['/usuario-list']),
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al guardar.';
        this.isSubmitting = false;
      },
    });
  }

  goToUsuarioList() {
    this.router.navigate(['/usuario-list']);
  }

  // Getters para validaciones
  get nombreControl() {
    return this.usuarioForm.get('nombre');
  }
  get emailControl() {
    return this.usuarioForm.get('email');
  }
  get rolControl() {
    return this.usuarioForm.get('rol');
  }
  get passwordControl() {
    return this.usuarioForm.get('password');
  }
}
