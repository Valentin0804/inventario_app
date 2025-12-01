import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import {
  ProductosService,
  Producto,
} from '../../core/services/productos.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { ProveedorService } from '../../core/services/proveedor.service';

@Component({
  selector: 'app-add-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-producto.component.html',
  styleUrls: ['./add-producto.component.css'],
})
export class AddProductoComponent implements OnInit {
  // Objeto inicial vacío
  producto: Producto = {
    nombre: '',
    precio_neto: 0,
    porcentaje_ganancia: 30, // Valor por defecto
    stock: 0,
    alarma_stock: 5,
  };

  editing: boolean = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  // Listas para los desplegables
  categorias: any[] = [];
  proveedores: any[] = [];

  constructor(
    private productosService: ProductosService,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProveedores();

    const params = this.activatedRoute.snapshot.params;
    if (params['id']) {
      this.editing = true;
      this.productosService.getProducto(params['id']).subscribe(
        (res) => (this.producto = res),
        (err) => console.error(err)
      );
    }
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      // Genera vista previa para mostrarla en pantalla
      const reader = new FileReader();
      reader.onload = (e) => (this.imagePreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe(
      (res) => (this.categorias = res),
      (err) => console.error(err)
    );
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe(
      (res) => (this.proveedores = res),
      (err) => console.error(err)
    );
  }

  guardar() {
    if (this.editing) {
      this.updateProducto();
    } else {
      this.saveProducto();
    }
  }

  saveProducto() {
    this.productosService
      .addProducto(this.producto, this.selectedFile)
      .subscribe({
        next: (res) => {
          console.log('Producto creado');
          this.router.navigate(['/producto-list']);
        },
        error: (err) => console.error(err),
      });
  }

  updateProducto() {
    if (this.producto.id) {
      this.productosService
        .updateProducto(this.producto.id, this.producto, this.selectedFile)
        .subscribe({
          next: (res) => {
            console.log('Producto actualizado');
            this.router.navigate(['/producto-list']);
          },
          error: (err) => console.error(err),
        });
    }
  }

  goToProductoList(): void {
    this.router.navigate(['/producto-list']);
  }
}
