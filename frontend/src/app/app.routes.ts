import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddProductoComponent } from './pages/add-producto/add-producto.component';
import { AddCategoriaComponent } from './pages/add-categoria/add-categoria.component';
import { AddProveedorComponent } from './pages/add-proveedor/add-proveedor.component';
import { ProveedorListComponent } from './pages/proveedor-list/proveedor-list.component';
import { CategoriaListComponent } from './pages/categoria-list/categoria-list.component';
import { ProductoListComponent } from './pages/producto-list/producto-list.component';
import { AddMetodoPagoComponent } from './pages/add-metodoPago/add-metodopago.component';
import { MetodoPagoListComponent } from './pages/metodoPago-list/metodoPago-list.component';
import { AddVentaComponent } from './pages/add-venta/add-venta.component';
import { VentaListComponent } from './pages/venta-list/venta-list.component';
import { EditVentaComponent } from './pages/edit-venta/edit-venta.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

  { path: 'add-producto', component: AddProductoComponent, canActivate: [authGuard]},
  { path: 'add-producto/:id', component: AddProductoComponent},
  { path: 'producto-list',  component: ProductoListComponent},

  { path: 'add-categoria', component: AddCategoriaComponent, canActivate: [authGuard]},
  { path: 'add-categoria/:id', component: AddCategoriaComponent},
  { path: 'categoria-list',  component: CategoriaListComponent},

  { path: 'add-proveedor',  component: AddProveedorComponent},
  { path: 'add-proveedor/:id',  component: AddProveedorComponent },
  { path: 'proveedor-list',  component: ProveedorListComponent},
  
  { path: 'add-metodopago', component: AddMetodoPagoComponent},
  { path: 'add-metodopago/:id', component: AddMetodoPagoComponent},
  { path: 'metodopago-list', component: MetodoPagoListComponent},
  
  { path: 'add-venta', component: AddVentaComponent},
  { path: 'add-venta/:id', component: AddVentaComponent},
  { path: 'venta-list', component: VentaListComponent},
  { path: 'ventas/edit/:id',  component: EditVentaComponent }

];
