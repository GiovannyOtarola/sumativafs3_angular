import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../services/producto.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SessionService } from '../services/session.service';
import { Router, RouterModule } from '@angular/router';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit {
  productos: Producto[] = [];
  productoForm: FormGroup;
  editingProducto: Producto | null = null;
  successMessage: string = '';
  errorMessage: string = '';
  isLoggedIn: boolean = false;
  usuarioId: number | null = null; // Variable para almacenar el ID del usuario autenticado

  constructor(
    private productoService: ProductoService,
    private fb: FormBuilder,
    private sessionService: SessionService,
    private router: Router
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    // Verificar estado de login
    this.isLoggedIn = this.sessionService.getSessionStatus();

    // Redirigir al login si no está logueado
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      // Obtener el usuario logueado desde el SessionService
      const loggedInUser = this.sessionService.getLoggedInUser();
      this.usuarioId = loggedInUser ? loggedInUser.id : null;

      // Obtener todos los productos
      this.loadProductos();
    }
  }

  loadProductos(): void {
    this.productoService.obtenerTodosLosProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
      },
      error: (err) => {
        this.errorMessage = 'Error al obtener los productos.';
        console.error(err);
      }
    });
  }

  // Agregar o actualizar producto
  saveProducto(): void {
    if (this.productoForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    const producto: Producto = this.productoForm.value;

    // Agregar el usuario_id al producto antes de enviarlo
    if (this.usuarioId) {
      producto.usuarioId = this.usuarioId;
    } else {
      this.errorMessage = 'No se pudo obtener el ID del usuario.';
      return;
    }

    if (this.editingProducto) {
      // Si estamos editando un producto, lo actualizamos
      if (this.editingProducto.id !== undefined) {
        this.productoService.actualizarProducto(this.editingProducto.id, producto).subscribe({
          next: () => {
            this.successMessage = 'Producto actualizado correctamente.';
            this.refreshProductList();
          },
          error: (err) => {
            this.errorMessage = 'Error al actualizar el producto.';
            console.error(err);
          }
        });
      } else {
        this.errorMessage = 'ID del producto no está definido.';
      }
    } else {
      // Si estamos agregando un nuevo producto
      this.productoService.crearProducto(producto).subscribe({
        next: () => {
          this.successMessage = 'Producto creado correctamente.';
          this.refreshProductList();
        },
        error: (err) => {
          this.errorMessage = 'Error al crear el producto.';
          console.error(err);
        }
      });
    }

    // Limpiar el formulario y finalizar la edición
    this.productoForm.reset();
    this.editingProducto = null;
  }

  // Editar producto
  editProducto(producto: Producto): void {
    this.editingProducto = producto;
    this.productoForm.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio
    });
  }

  // Eliminar producto
  deleteProducto(id: number): void {
    this.productoService.eliminarProducto(id).subscribe({
      next: () => {
        this.successMessage = 'Producto eliminado correctamente.';
        this.refreshProductList();
      },
      error: (err) => {
        this.errorMessage = 'Error al eliminar el producto.';
        console.error(err);
      }
    });
  }

  // Método para refrescar la lista de productos
  refreshProductList(): void {
    this.loadProductos();  // Reutiliza el método que ya carga los productos
  }

  // Cancelar edición
  cancelEdit(): void {
    this.editingProducto = null;
    this.productoForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Cerrar sesión
  logout(): void {
    this.sessionService.logout();
    this.router.navigate(['/login']);
  }

  // Redirigir al login
  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Redirigir al login
  redirectToProductos(): void {
    this.router.navigate(['/productos']);
  }

  // Redirigir al perfil del usuario
  redirectToPerfil(): void {
    this.router.navigate(['/perfil']);
  }
}