import { Component } from '@angular/core';
import { Producto } from '../../models/producto.model';
import { CarritoService } from '../services/carrito.service';
import { CompraService } from '../services/compra.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  carrito: Producto[] = [];
  successMessage: string = '';
  errorMessage: string = '';
  total: number = 0;
  constructor(
    public  carritoService: CarritoService,
    private compraService: CompraService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carrito = this.carritoService.obtenerCarrito();
    this.calcularTotal();
  }

  realizarCompra(): void {
    if (this.carrito.length === 0) {
      this.errorMessage = 'El carrito está vacío.';
      return;
    }
  
    const compras = this.carrito.map((producto) => ({
      productoId: producto.id!,
      cantidad: 1, // Por simplicidad, puedes permitir al usuario seleccionar cantidades en el futuro.
      usuarioId: 1, // Usa el ID del usuario autenticado.
    }));
  
    const comprasObservables = compras.map((compra) =>
      this.compraService.realizarCompra(compra)
    );
  
    // Ejecutar todas las compras en paralelo
    forkJoin(comprasObservables).subscribe({
      next: () => {
        this.successMessage = 'Compra realizada correctamente.';
        // Vaciar el carrito tras realizar todas las compras
        this.carritoService.vaciarCarrito();
        this.carrito = [];
        this.calcularTotal();
      },
      error: (err) => {
        this.errorMessage = 'Error al realizar la compra.';
        console.error(err);
      },
    });
  }

  calcularTotal(): void {
    this.total = this.carrito.reduce((sum, producto) => sum + producto.precio, 0);
  }

  eliminarProducto(index: number): void {
    this.carritoService.eliminarProducto(index);
    this.carrito = this.carritoService.obtenerCarrito();
    this.calcularTotal(); // Recalcula el total después de eliminar un producto
  }

  redirectToProductos(): void {
    this.router.navigate(['/productos']);
  }
}
