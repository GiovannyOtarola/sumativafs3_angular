import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { RegistroComponent } from './components/registro/registro.component';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { AdminComponent } from './components/admin/admin.component';
import { ProductosComponent } from './components/productos/productos.component';
import { CarritoComponent } from './components/carrito/carrito.component';

export const routes: Routes = [

    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'perfil', component: PerfilComponent},
    {path: 'principal', component: PrincipalComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'recuperar', component: RecuperarPasswordComponent},
    {path: 'admin', component: AdminComponent},
    {path: 'productos', component: ProductosComponent},
    {path: 'carrito', component: CarritoComponent},
];
