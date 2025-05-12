import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { CuponDTO } from '../../dto/cupon/cupon-dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cupones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cupones.component.html',
  styleUrl: './cupones.component.css'
})
export class CuponesComponent implements OnInit {
  cupones: CuponDTO[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarCupones();
  }

  cargarCupones(): void {
    this.adminService.listarCupones().subscribe({
      next: (response) => {
        this.cupones = response.respuesta;
      },
      error: (error) => {
        console.error('Error al cargar cupones:', error);
        this.mostrarError('Error al cargar los cupones');
      }
    });
  }

  confirmarEliminar(cupon: CuponDTO): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el cupón "${cupon.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarCupon(cupon.id);
      }
    });
  }

  private eliminarCupon(id: string): void {
    this.adminService.eliminarCupon(id).subscribe({
      next: () => {
        Swal.fire(
          '¡Eliminado!',
          'El cupón ha sido eliminado correctamente.',
          'success'
        );
        this.cargarCupones();
      },
      error: (error) => {
        console.error('Error al eliminar cupón:', error);
        this.mostrarError('Error al eliminar el cupón');
      }
    });
  }

  private mostrarError(mensaje: string): void {
    Swal.fire('Error', mensaje, 'error');
  }
}