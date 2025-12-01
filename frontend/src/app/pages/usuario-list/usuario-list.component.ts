import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService, Usuario } from '../../core/services/usuario.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {

  usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (res) => this.usuarios = res,
      error: (err) => console.log(err)
    });
  }

  eliminar(id: number) {
    if (!confirm("¿Eliminar usuario?")) return;

    this.usuarioService.eliminarUsuario(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: () => alert("Error al eliminar")
    });
  }
}
