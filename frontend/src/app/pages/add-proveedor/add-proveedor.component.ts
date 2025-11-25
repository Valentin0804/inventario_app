import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Proveedor,  ProveedorService } from '../../core/services/proveedor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-proveedor',
  templateUrl: './add-proveedor.component.html',
  standalone: true,
  styleUrls: ['./add-proveedor.component.css'],
  imports:[CommonModule, FormsModule, RouterModule]
})

export class AddProveedorComponent implements OnInit {
  proveedor: Proveedor = { nombre: '', telefono: '', direccion: '' };
  editing = false;

  constructor(
    private proveedorService: ProveedorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.editing = true;
      this.proveedorService.getProveedorById(+id).subscribe(data => {
        this.proveedor = data;
      });
    }
  }

  guardar() {
    if (this.editing) {
      this.proveedorService.updateProveedor(this.proveedor.id!, this.proveedor)
        .subscribe(() => {
          alert("Proveedor actualizado con éxito");
          this.router.navigate(['/proveedor-list']);
        });
    } else {
      this.proveedorService.addProveedor(this.proveedor)
        .subscribe(() => {
          alert("Proveedor creado con éxito");
          this.router.navigate(['/proveedor-list']);
        });
    }
  }
}
