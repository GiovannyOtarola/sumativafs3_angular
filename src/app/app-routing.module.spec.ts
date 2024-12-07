import { TestBed } from '@angular/core/testing';
import { RouterModule, Routes } from '@angular/router';
import { Router } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { RegistroComponent } from './components/registro/registro.component';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { AdminComponent } from './components/admin/admin.component';
import { ProductosComponent } from './components/productos/productos.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { routes } from './app.routes';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('App Routing', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes),HttpClientTestingModule]
    });

    router = TestBed.inject(Router);
    router.initialNavigation();  // Inicia las rutas
  });

  it('should navigate to login', async () => {
    const fixture = TestBed.createComponent(LoginComponent);
    await router.navigate(['/login']);
    expect(router.url).toBe('/login');
  });

  it('should navigate to perfil', async () => {
    const fixture = TestBed.createComponent(PerfilComponent);
    await router.navigate(['/perfil']);
    expect(router.url).toBe('/perfil');
  });

  it('should navigate to principal', async () => {
    const fixture = TestBed.createComponent(PrincipalComponent);
    await router.navigate(['/principal']);
    expect(router.url).toBe('/principal');
  });

  it('should navigate to registro', async () => {
    const fixture = TestBed.createComponent(RegistroComponent);
    await router.navigate(['/registro']);
    expect(router.url).toBe('/registro');
  });

  it('should navigate to recuperar password', async () => {
    const fixture = TestBed.createComponent(RecuperarPasswordComponent);
    await router.navigate(['/recuperar']);
    expect(router.url).toBe('/recuperar');
  });

  it('should navigate to admin', async () => {
    const fixture = TestBed.createComponent(AdminComponent);
    await router.navigate(['/admin']);
    expect(router.url).toBe('/admin');
  });

  it('should navigate to productos', async () => {
    const fixture = TestBed.createComponent(ProductosComponent);
    await router.navigate(['/productos']);
    expect(router.url).toBe('/productos');
  });

  it('should navigate to carrito', async () => {
    const fixture = TestBed.createComponent(CarritoComponent);
    await router.navigate(['/carrito']);
    expect(router.url).toBe('/carrito');
  });

  it('should redirect to login when path is empty', async () => {
    await router.navigate(['']);
    expect(router.url).toBe('/login');
  });
});