import { Component, OnInit, PLATFORM_ID, Inject} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
    private tokenService: TokenService,
    @Inject(PLATFORM_ID) public platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarHistorialCitas();
    }
  }

  isPlatformBrowser(platformId: Object): boolean {
    return isPlatformBrowser(platformId);
  }

  /**
   * Carga el historial de citas del cliente desde el backend
   */
  cargarHistorialCitas(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const clienteId = this.tokenService.getIDCuenta();
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