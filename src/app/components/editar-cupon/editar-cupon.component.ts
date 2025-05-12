import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { EditarCuponDTO } from '../../dto/cupon/editar-cupon-dto';
import { EstadoCupon } from '../../enums/EstadoCupon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-cupon',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './editar-cupon.component.html',
  styleUrl: './editar-cupon.component.css'
})
export class EditarCuponComponent implements OnInit {
  cupon: EditarCuponDTO = {
    id: '',
    codigo: '',
    nombre: '',
    porcentajeDescuento: 0,
    estadoCupon: EstadoCupon.INACTIVO, // Use a valid EstadoCupon value
    fechaVencimiento: ''
  };
  cargando = true;
  EstadoCupon = EstadoCupon;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.cargarCupon(id);
      } else {
        this.mostrarError('ID de cupón no proporcionado');
        this.router.navigate(['/cupones']);
      }
    });
  }

  toggleEstado(checked: boolean) {
    this.cupon.estadoCupon = checked ? EstadoCupon.ACTIVO : EstadoCupon.INACTIVO;
  }
  
  cargarCupon(id: string): void {
    this.adminService.obtenerInformacionCupon(id).subscribe({
        next: (response) => {
            if (response && response.respuesta) {
                this.cupon = {
                    ...response.respuesta,
                    estadoCupon: response.respuesta.estadoCupon === 'ACTIVO' ? 
                        EstadoCupon.ACTIVO : EstadoCupon.INACTIVO
                };
                this.cargando = false;
            }
        },
      error: (error) => {
        console.error('Component - HTTP Error:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
        
        if (error.status === 500) {
          this.mostrarError('Error interno del servidor al cargar el cupón');
        } else if (error.status === 404) {
          this.mostrarError('No se encontró el cupón especificado');
        } else {
          this.mostrarError(`Error al cargar el cupón: ${error.error?.mensaje || 'Error desconocido'}`);
        }
      }
    });
  }

  guardarCambios(): void {
    if (this.validarFormulario()) {
      console.log('Datos a enviar:', this.cupon); // Log para ver los datos
  
      Swal.fire({
        title: '¿Guardar cambios?',
        text: 'Se actualizará la información del cupón',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.adminService.editarCupon(this.cupon).subscribe({
            next: (response) => {
              console.log('Respuesta del servidor:', response); // Log de respuesta exitosa
              Swal.fire(
                '¡Guardado!',
                'Los cambios han sido guardados exitosamente.',
                'success'
              ).then(() => {
                this.router.navigate(['/admin/cupones']); // Corregir ruta
              });
            },
            error: (error) => {
              console.error('Error detallado:', {
                status: error.status,
                message: error.message,
                error: error.error
              });
              this.mostrarError(error.error?.mensaje || 'Error al guardar los cambios');
            }
          });
        }
      });
    }
  }

  validarFormulario(): boolean {
    if (!this.cupon.codigo || !this.cupon.nombre || !this.cupon.porcentajeDescuento || !this.cupon.fechaVencimiento) {
      this.mostrarError('Por favor complete todos los campos obligatorios');
      return false;
    }

    if (this.cupon.porcentajeDescuento <= 0 || this.cupon.porcentajeDescuento > 100) {
      this.mostrarError('El porcentaje de descuento debe estar entre 1 y 100');
      return false;
    }

    return true;
  }

  private mostrarError(mensaje: string): void {
    Swal.fire('Error', mensaje, 'error');
  }
}