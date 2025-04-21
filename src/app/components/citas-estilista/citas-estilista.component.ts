import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EstilistaService } from '../../services/estilista.service';
import { TokenService } from '../../services/token.service';
import { InformacionCitaDTO } from '../../dto/cita/informacion-cita-dto';
import { EstadoCita } from '../../dto/cita/estados-cita.enum';
import { FormsModule } from '@angular/forms';

/**
 * Componente para visualizar las citas del estilista actual
 * Muestra un listado de citas ordenadas cronológicamente
 */
@Component({
  selector: 'app-citas-estilista',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './citas-estilista.component.html',
  styleUrls: ['./citas-estilista.component.css'],
})
export class CitasEstilistaComponent implements OnInit {
  citas: InformacionCitaDTO[] = []; // Arreglo que almacena todas las citas del estilista
  citasFiltradas: InformacionCitaDTO[] = []; // Citas después de aplicar filtros
  estadosFiltro: string[] = Object.values(EstadoCita); // Estados disponibles para filtrar
  filtroEstado: string = ''; // Estado seleccionado en el filtro
  
  // Información para el modal de detalle
  citaSeleccionada: InformacionCitaDTO | null = null;
  nombreServicio: string = '';
  nombreCliente: string = '';
  
  // Estados de carga
  cargando: boolean = true;
  error: string | null = null;

  constructor(
    private estilistaService: EstilistaService,
    private tokenService: TokenService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    let intentos = 0;
    const maxIntentos = 20;

    const interval = setInterval(() => {
      const id = this.tokenService.getIDCuenta();
      if (id) {
        clearInterval(interval);
        this.cargarCitas(id);
      }
      if (++intentos >= maxIntentos) {
        this.error = 'No se pudo obtener su identificación. Por favor, vuelva a iniciar sesión.';
        this.cargando = false;
        console.error('No se pudo obtener el ID del token tras varios intentos.');
        clearInterval(interval);
      }
    }, 100);
  }

  /**
   * Carga las citas del estilista desde el servicio
   * @param idEstilista ID del estilista actual
   */
  cargarCitas(idEstilista: string): void {
    this.cargando = true;
    console.log('Cargando citas para el estilista:', idEstilista);

    this.estilistaService.obtenerMisCitas(idEstilista).subscribe({
      next: (data) => {
        this.citas = data.respuesta;
        // Ordenar por fecha (las más próximas primero)
        this.citas.sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
        this.citasFiltradas = [...this.citas];
        this.cargando = false;
        console.log('Citas cargadas:', this.citas);
      },
      error: (error) => {
        this.error = 'Error al cargar las citas. Intente nuevamente.';
        this.cargando = false;
        console.error('Error al obtener citas:', error);
      },
    });
  }

  /**
   * Aplica el filtro por estado a las citas
   */
  aplicarFiltro(): void {
    if (!this.filtroEstado) {
      this.citasFiltradas = [...this.citas];
      return;
    }
    
    this.citasFiltradas = this.citas.filter(cita => 
      cita.estado === this.filtroEstado
    );
  }

  /**
   * Formatea la fecha para mostrarla en la interfaz
   * @param fecha Fecha a formatear
   * @returns Fecha formateada como string
   */
  formatearFecha(fecha: Date | string): string {
    return this.datePipe.transform(fecha, 'dd/MM/yyyy HH:mm') || '';
  }

  /**
   * Determina si una cita ya pasó su horario
   * @param fecha Fecha de la cita a evaluar
   * @returns true si la cita ya pasó
   */
  esHistorica(fecha: Date | string): boolean {
    const fechaCita = new Date(fecha);
    const ahora = new Date();
    return fechaCita < ahora;
  }

  /**
   * Abre el modal con los detalles de la cita seleccionada
   * @param cita Cita a mostrar en detalle
   */
  verDetalle(cita: InformacionCitaDTO): void {
    this.citaSeleccionada = cita;
    
    // Aquí normalmente obtendrías el nombre del servicio y cliente desde otro servicio
    // Por ahora usamos IDs como placeholder
    this.nombreServicio = `Servicio ID: ${cita.servicioId}`;
    this.nombreCliente = `Cliente ID: ${cita.usuarioId}`;

    const modal = document.getElementById('modalDetalleCita');
    if (modal) {
      const modalBootstrap = new (window as any).bootstrap.Modal(modal);
      modalBootstrap.show();
    }
  }

  /**
   * Devuelve la clase CSS según el estado de la cita
   * @param estado Estado de la cita
   * @returns Nombre de clase CSS
   */
  obtenerClaseEstado(estado: EstadoCita): string {
    switch (estado) {
      case EstadoCita.CONFIRMADA: 
        return 'estado-confirmada';
      case EstadoCita.REPROGRAMADA: 
        return 'estado-reprogramada';
      case EstadoCita.LISTA_ESPERA: 
        return 'estado-espera';
      case EstadoCita.CANCELADA: 
        return 'estado-cancelada';
      case EstadoCita.COMPLETADA: 
        return 'estado-completada';
      default: 
        return '';
    }
  }
}
