import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Router, RouterModule } from '@angular/router';
import { CrearCuponDTO } from '../../dto/cupon/crear-cupon-dto';

@Component({
  selector: 'app-crear-cupon',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-cupon.component.html',
  styleUrl: './crear-cupon.component.css'
})
export class CrearCuponComponent {
  cupon: CrearCuponDTO = {
    codigo: '',
    nombre: '',
    porcentajeDescuento: 0,
    fechaVencimiento: ''
  };

  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }

  crearCupon(): void {
    if (this.validarFormulario()) {
      this.adminService.crearCupon(this.cupon).subscribe({
        next: (response) => {
          alert('Cupón creado exitosamente');
          this.router.navigate(['/admin/cupones']);
        },
        error: (error) => {
          console.error('Error al crear el cupón:', error);
          alert(error.error?.mensaje || 'Error al crear el cupón');
        }
      });
    }
  }

  validarFormulario(): boolean {
    if (!this.cupon.codigo || !this.cupon.nombre || 
        !this.cupon.porcentajeDescuento || !this.cupon.fechaVencimiento) {
      alert('Por favor complete todos los campos obligatorios');
      return false;
    }

    if (this.cupon.porcentajeDescuento <= 0 || this.cupon.porcentajeDescuento > 100) {
      alert('El descuento debe estar entre 1 y 100');
      return false;
    }

    const fechaVencimiento = new Date(this.cupon.fechaVencimiento);
    const ahora = new Date();
    
    if (fechaVencimiento <= ahora) {
      alert('La fecha de vencimiento debe ser posterior a la fecha actual');
      return false;
    }

    return true;
  }
}