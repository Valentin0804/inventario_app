import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // <-- Importar ActivatedRoute
import { CategoriaService } from '../../core/services/categoria.service';
import { CommonModule } from '@angular/common';

interface Categoria {
  id?: number; 
  nombre: string;
  descripcion?: string;
}

@Component({
  selector: 'app-add-categoria',
  templateUrl: './add-categoria.component.html',
  styleUrls: ['./add-categoria.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule]
})

export class AddCategoriaComponent implements OnInit {

  categoriaForm!: FormGroup;
  errorMessage: string | null = null;
  isSubmitting: boolean = false;
  editing: boolean = false; 
  categoriaId: number | null = null; 

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute 
  ) { }

  ngOnInit(): void {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.maxLength(250)]]
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editing = true;
      this.categoriaId = +id; // Convertir string a number
      this.isSubmitting = true; // Mostrar "Cargando..." o similar mientras se carga
      this.errorMessage = null;

      this.categoriaService.getCategoriaById(this.categoriaId).subscribe({
        next: (categoria: Categoria) => {
          this.categoriaForm.patchValue(categoria); // Rellenar el formulario con los datos
          this.isSubmitting = false; // Desactivar el estado de subida
        },
        error: (error: any) => {
          console.error('Error al cargar categoría:', error);
          this.errorMessage = 'No se pudo cargar la categoría para edición.';
          this.isSubmitting = false; // Desactivar el estado de subida
        }
      });
    }
  }

  get nombreControl() {
    return this.categoriaForm.get('nombre');
  }

  get descripcionControl() {
    return this.categoriaForm.get('descripcion');
  }

  guardar(): void {
    this.isSubmitting = true;
    this.errorMessage = null;

    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      this.isSubmitting = false;
      return;
    }

    const categoriaData: Categoria = this.categoriaForm.value;

    if (this.editing && this.categoriaId) {
      this.categoriaService.updateCategoria(this.categoriaId, categoriaData).subscribe({
        next: (response: any) => {
          console.log('Categoría actualizada con éxito:', response);
          this.isSubmitting = false;
          this.router.navigate(['/categoria-list']);
        },
        error: (error: any) => {
          console.error('Error al actualizar categoría:', error);
          this.errorMessage = 'Hubo un error al actualizar la categoría. Inténtalo de nuevo.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.categoriaService.addCategoria(categoriaData).subscribe({
        next: (response: any) => {
          console.log('Categoría agregada con éxito:', response);
          this.isSubmitting = false;
          this.router.navigate(['/categoria-list']);
        },
        error: (error: any) => {
          console.error('Error al agregar categoría:', error);
          this.errorMessage = 'Hubo un error al guardar la categoría. Inténtalo de nuevo.';
          this.isSubmitting = false;
        }
      });
    }
  }

  goToCategoryList(): void {
    this.router.navigate(['/categoria-list']);
  }
}