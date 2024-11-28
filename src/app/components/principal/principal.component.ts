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
      // Obtener todos los productos cuando se inicialice el componente
      this.productoService.obtenerTodosLosProductos().subscribe(productos => {
        this.productos = productos;
      });
    }
  }

  // Agregar o actualizar producto
  saveProducto(): void {
    if (this.productoForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    const producto: Producto = this.productoForm.value;

    
    if (this.editingProducto) {
      // Si estamos editando un producto, lo actualizamos
      if (this.editingProducto.id !== undefined) {
        this.productoService.actualizarProducto(this.editingProducto.id, producto).subscribe(response => {
          this.successMessage = 'Producto actualizado correctamente.';
          this.errorMessage = '';
          this.refreshProductList();
        });
      } else {
        this.errorMessage = 'ID del producto no está definido.';
      }
    } else {
      // Si estamos agregando un nuevo producto
      this.productoService.crearProducto(producto).subscribe(response => {
        this.successMessage = 'Producto creado correctamente.';
        this.errorMessage = '';
        this.refreshProductList();
      });
    }

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
    this.productoService.eliminarProducto(id).subscribe(response => {
      this.successMessage = 'Producto eliminado correctamente.';
      this.errorMessage = '';
      this.refreshProductList();
    });
  }

  // Método para refrescar la lista de productos
  refreshProductList(): void {
    this.productoService.obtenerTodosLosProductos().subscribe(productos => {
      this.productos = productos;
    });
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

  redirectToPerfil(): void {
    this.router.navigate(['/perfil']);
  }
}