import { Component, OnInit, inject, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';
import { InformacionCitaDTO } from '../../dto/mis-citas/informacion-cita-dto';
import { ReprogramarCitaDTO } from '../../dto/mis-citas/reprogramar-cita-dto';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../services/token.service';	
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

declare var bootstrap: any; // Para manejar el modal de Bootstrap

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mis-citas.component.html',
  styleUrls: ['./mis-citas.component.css']
})
export class MisCitasComponent implements OnInit {
  citas: InformacionCitaDTO[] = [];
  clienteId: string = '';
  citaSeleccionada: string = ''; // ID de la cita seleccionada
  nuevaFechaHora: string = ''; // Nueva fecha y hora para la reprogramación

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private clienteService: ClienteService, private tokenService: TokenService) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarCitas();
    }
  }

  cargarCitas(): void {
    this.clienteId = this.tokenService.getIDCuenta();
    console.log('ID del cliente:', this.clienteId);

    this.clienteService.obtenerCitasPorClienteId(this.clienteId).subscribe({
      next: (data) => {
        this.citas = data.respuesta;
        console.log('Citas cargadas:', this.citas);
      },
      error: (error) => {
        console.error('Error al obtener citas:', error);
      }
    });
  }

  cancelarCita(index: number): void {
    const citaId = this.citas[index].citaId;
    this.clienteService.cancelarCita(citaId).subscribe({
      next: (data) => {
        console.log(data.respuesta);
        this.citas.splice(index, 1);
      },
      error: (error) => {
        console.error('Error al cancelar la cita:', error);
      }
    });
  }

  abrirModalReprogramar(index: number): void {
    this.citaSeleccionada = this.citas[index].citaId; // Guarda el ID de la cita seleccionada
    this.nuevaFechaHora = ''; // Limpia el campo de fecha y hora
    const modal = new bootstrap.Modal(document.getElementById('modalReprogramar'));
    modal.show();
  }

  confirmarReprogramacion(): void {
    const reprogramarCitaDTO: ReprogramarCitaDTO = {
      citaId: this.citaSeleccionada,
      nuevaFechaHora: this.nuevaFechaHora.replace('T', ' ') // Ajusta el formato para el backend
    };

    this.clienteService.reprogramarCita(reprogramarCitaDTO).subscribe({
      next: (data) => {
        console.log('Cita reprogramada con éxito:', data.respuesta);
        alert('Cita reprogramada con éxito');
        this.cargarCitas(); // Recarga las citas
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalReprogramar'));
        modal.hide();
      },
      error: (error) => {
        console.error('Error al reprogramar la cita:', error);
        alert('Error al reprogramar la cita: ' + error.error.respuesta);
      }
    });
  }
}