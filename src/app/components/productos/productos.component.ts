import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../services/producto.service';
import { CarritoService } from '../services/carrito.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})

export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  errorMessage: string = '';

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProductos();
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

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarProducto(producto);
    alert(`Producto ${producto.nombre} agregado al carrito.`);
  }

  irAlCarrito(): void {
    this.router.navigate(['/carrito']); // Cambia la ruta según tu configuración de rutas
  }

  volver(): void {
    this.router.navigate(['/principal']); // Cambia la ruta según tu configuración de rutas
  }
}