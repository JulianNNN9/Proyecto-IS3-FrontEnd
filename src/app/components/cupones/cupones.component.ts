import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { CuponDTO } from '../../dto/cupon/cupon-dto';
import { EditarCuponDTO } from '../../dto/cupon/editar-cupon-dto';

@Component({
  selector: 'app-cupones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cupones.component.html',
  styleUrl: './cupones.component.css'
})
export class CuponesComponent implements OnInit {
  @ViewChild('editForm') editForm!: NgForm;

  cupones: CuponDTO[] = [];
  cuponSeleccionado: EditarCuponDTO | null = null;
  mostrarModal = false;
  formularioListo = false;
  modalVisible = false;

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarCupones();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  abrirModalEditar(cupon: CuponDTO): void {
    this.cuponSeleccionado = {
      id: cupon.id,
      codigo: cupon.codigo,
      nombre: cupon.nombre,
      porcentajeDescuento: cupon.porcentajeDescuento,
      estadoCupon: cupon.estadoCupon,
      fechaVencimiento: cupon.fechaVencimiento
    };
    this.mostrarModal = true;
    this.modalVisible = true;
    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.modalVisible = false;
    this.cuponSeleccionado = null;
  }

  isFormValid(): boolean {
    if (!this.editForm) return false;
    return this.editForm.valid ?? false;
  }

  cargarCupones(): void {
    this.adminService.listarCupones().subscribe({
      next: (response) => {
        console.log('Cupones recibidos:', response.respuesta); // Agregar este log
        this.cupones = response.respuesta;
      },
      error: (error) => {
        console.error('Error al cargar cupones:', error);
        alert('Error al cargar los cupones');
      }
    });
  }

  guardarCambios(): void {
    if (!this.cuponSeleccionado) return;

    this.adminService.editarCupon(this.cuponSeleccionado).subscribe({
      next: (response) => {
        alert('Cupón actualizado exitosamente');
        this.cerrarModal();
        this.cargarCupones();
      },
      error: (error) => {
        console.error('Error al actualizar cupón:', error);
        alert(error.error?.mensaje || 'Error al actualizar el cupón');
      }
    });
  }

  eliminarCupon(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este cupón?')) {
      this.adminService.eliminarCupon(id).subscribe({
        next: (response) => {
          alert('Cupón eliminado exitosamente');
          this.cargarCupones();
        },
        error: (error) => {
          console.error('Error al eliminar cupón:', error);
          alert(error.error?.mensaje || 'Error al eliminar el cupón');
        }
      });
    }
  }

  
}