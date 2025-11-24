import { Component, OnInit } from '@angular/core';
import { CategoriaService, Categoria } from '../../core/services/categoria.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria-list',
  templateUrl: './categoria-list.component.html',
  styleUrls: ['./categoria-list.component.css'],
  standalone: true,
  imports:[CommonModule, RouterModule]
})

export class CategoriaListComponent implements OnInit {
  
  categorias: Categoria[] = [];

  constructor(
    private categoriaService: CategoriaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarCategoria();
  }

    cargarCategoria() {
      this.categoriaService.getCategorias().subscribe(data => {
      this.categorias = data;
    });
  }

    eliminar(id: number){
        if(confirm("¿seguro que desear eliminar esta categoria?")) {
            this.categoriaService.deleteCategoria(id).subscribe( ()=> {
                alert("categoria eliminada correctamente");
                this.cargarCategoria();
        });
            }
        }  
    }
