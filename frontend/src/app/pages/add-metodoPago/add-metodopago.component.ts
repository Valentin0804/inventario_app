import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; 
import { MetodoPagoService } from '../../core/services/metodoPago.service';
import { CommonModule } from '@angular/common';

interface MetodoPago {
  id?: number; 
  nombre: string;
}

@Component({
  selector: 'app-add-metodopago',
  templateUrl: './add-metodopago.component.html',
  styleUrls: ['./add-metodopago.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule]
})

export class AddMetodoPagoComponent implements OnInit {

  MetodoPagoForm!: FormGroup;
  errorMessage: string | null = null;
  isSubmitting: boolean = false;
  editing: boolean = false; 
  MetodoPagoId: number | null = null; 

  constructor(
    private fb: FormBuilder,
    private MetodoPagoService: MetodoPagoService,
    private router: Router,
    private route: ActivatedRoute 
  ) { }

  ngOnInit(): void {
    this.MetodoPagoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editing = true;
      this.MetodoPagoId = +id; // Convertir string a number
      this.isSubmitting = true; // Mostrar "Cargando..." o similar mientras se carga
      this.errorMessage = null;

      this.MetodoPagoService.getMetodoPago(this.MetodoPagoId).subscribe({
        next: (MetodoPago: MetodoPago) => {
          this.MetodoPagoForm.patchValue(MetodoPago); // Rellenar el formulario con los datos
          this.isSubmitting = false; // Desactivar el estado de subida
        },
        error: (error: any) => {
          console.error('Error al cargar Metodo de Pago:', error);
          this.errorMessage = 'No se pudo cargar el metodo de pago para edición.';
          this.isSubmitting = false; // Desactivar el estado de subida
        }
      });
    }
  }

  get nombreControl() {
    return this.MetodoPagoForm.get('nombre');
  }

  guardar(): void {
    this.isSubmitting = true;
    this.errorMessage = null;

    if (this.MetodoPagoForm.invalid) {
      this.MetodoPagoForm.markAllAsTouched();
      this.isSubmitting = false;
      return;
    }

    const MetodoPagoData: MetodoPago = this.MetodoPagoForm.value;

    if (this.editing && this.MetodoPagoId) {
      this.MetodoPagoService.updateMetodoPago(this.MetodoPagoId, MetodoPagoData).subscribe({
        next: (response: any) => {
          console.log('Metodo de Pago actualizado con éxito:', response);
          this.isSubmitting = false;
          this.router.navigate(['/metodopago-list']);
        },
        error: (error: any) => {
          console.error('Error al actualizar el Metodo de Pago:', error);
          this.errorMessage = 'Hubo un error al actualizar el metodo de pago. Inténtalo de nuevo.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.MetodoPagoService.addMetodoPago(MetodoPagoData).subscribe({
        next: (response: any) => {
          console.log('Metodo de Pago agregado con éxito:', response);
          this.isSubmitting = false;
          this.router.navigate(['/metodopago-list']);
        },
        error: (error: any) => {
          console.error('Error al agregar el Metodo de Pago:', error);
          this.errorMessage = 'Hubo un error al guardar el Metodo de Pago. Inténtalo de nuevo.';
          this.isSubmitting = false;
        }
      });
    }
  }

  goToMetodoPagoList(): void {
    this.router.navigate(['/metodopago-list']);
  }
}