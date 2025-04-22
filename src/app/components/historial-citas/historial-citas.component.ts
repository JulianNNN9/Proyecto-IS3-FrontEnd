import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';
import { InformacionCitaDTO } from '../../dto/mis-citas/informacion-cita-dto';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-historial-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-citas.component.html',
  styleUrls: ['./historial-citas.component.css']
})
export class HistorialCitasComponent implements OnInit {
  historialCitas: InformacionCitaDTO[] = []; // Lista de citas del historial

  constructor(
    private clienteService: ClienteService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.cargarHistorialCitas();
  }

  /**
   * Carga el historial de citas del cliente desde el backend
   */
  cargarHistorialCitas(): void {
    const clienteId = this.tokenService.getIDCuenta(); // Obtiene el ID del cliente desde el token
    this.clienteService.obtenerCitasCanceladasYCompletadas(clienteId).subscribe({
      next: (data) => {
        this.historialCitas = data.respuesta;
        console.log('Historial de citas cargado:', this.historialCitas);
      },
      error: (error) => {
        console.error('Error al cargar el historial de citas:', error);
      }
    });
  }

  /**
   * Navega a la página anterior
   */
  volver(): void {
    window.history.back(); // Regresa a la página anterior
  }
}