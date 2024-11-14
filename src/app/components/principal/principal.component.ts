import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../services/producto.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit {
  productos: Producto[] = [];
  productoForm: FormGroup;
  editingProducto: Producto | null = null;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private productoService: ProductoService, private fb: FormBuilder) {
    // Inicialización del formulario
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    // Obtener todos los productos cuando se inicialice el componente
    this.productoService.getAllProductos().subscribe(productos => {
      this.productos = productos;
    });
  }

  // Agregar o actualizar producto
  saveProducto(): void {
    if (this.productoForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    const producto: Producto = this.productoForm.value;
    
    if (this.editingProducto) {
      // Actualizar producto
      producto.id = this.editingProducto.id; // Mantener el id
      this.productoService.updateProducto(producto).subscribe(response => {
        if (response.success) {
          this.successMessage = 'Producto actualizado correctamente.';
          this.errorMessage = '';
          this.productoService.getAllProductos().subscribe(productos => {
            this.productos = productos;
          });
        } else {
          this.errorMessage = response.message || 'Error al actualizar el producto';
        }
      });
    } else {
      // Crear nuevo producto
      const newId = this.productos.length + 1; // Generar nuevo id
      producto.id = newId;
      this.productoService.addProducto(producto).subscribe(response => {
        if (response.success) {
          this.successMessage = 'Producto creado correctamente.';
          this.errorMessage = '';
          this.productoService.getAllProductos().subscribe(productos => {
            this.productos = productos;
          });
        } else {
          this.errorMessage = response.message || 'Error al crear el producto';
        }
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
    this.productoService.deleteProducto(id).subscribe(response => {
      if (response.success) {
        this.successMessage = 'Producto eliminado correctamente.';
        this.errorMessage = '';
        this.productoService.getAllProductos().subscribe(productos => {
          this.productos = productos;
        });
      } else {
        this.errorMessage = response.message || 'Error al eliminar el producto';
      }
    });
  }

  // Cancelar edición
  cancelEdit(): void {
    this.editingProducto = null;
    this.productoForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }
}
