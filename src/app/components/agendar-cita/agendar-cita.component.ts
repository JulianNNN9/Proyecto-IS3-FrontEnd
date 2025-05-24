import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { CrearCitaDTO } from '../../dto/mis-citas/crear-cita-dto';
import { TokenService } from '../../services/token.service';
import { FullCalendarModule } from '@fullcalendar/angular'; // Importa FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarioCitasDTO } from '../../dto/cita/calendario-citas-dto';
import { HttpHeaders } from '@angular/common/http';
import {PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Calendar } from '@fullcalendar/core';


@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './agendar-cita.component.html',
  styleUrls: ['./agendar-cita.component.css']
})
export class AgendarCitaComponent implements OnInit {
  estilistas: { id: string; nombre: string }[] = [];
  servicios: { id: string; nombre: string }[] = [];
  cita = {
    estilistaId: '',
    servicioId: '',
    fechaHora: ''
  };
  calendarOptions: any = {}; // Initialize as empty object
  private calendar: Calendar | null = null;
  horariosOcupados: any[] = []; // Lista de horarios ocupados

  constructor(
    private clienteService: ClienteService,
    private tokenService: TokenService,
    @Inject(PLATFORM_ID) public platformId: Object
  ) {}

  isPlatformBrowser(platformId: Object): boolean {
    return isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarEstilistas();
      this.cargarServicios();
      this.cargarHorariosOcupados();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeCalendar();
      });
    }
  }

  private initializeCalendar(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      allDaySlot: false,
      slotMinTime: '08:00:00',
      slotMaxTime: '19:00:00',
      slotDuration: '01:00:00',
      validRange: (nowDate: Date) => {
        return {
          start: nowDate,
          end: new Date(nowDate.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days ahead
        };
      },
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,timeGridDay'
      },
      expandRows: true,
      height: '650px',
      selectable: true,
      select: this.seleccionarHorario.bind(this),
      selectConstraint: {
        startTime: '08:00',
        endTime: '19:00',
      }
    };
  }

  cargarEstilistas(): void {
    this.clienteService.obtenerEstilistas().subscribe({
      next: (data) => {
        this.estilistas = data.respuesta.map((estilista: any) => ({
          id: estilista.id,
          nombre: estilista.nombre
        }));
        console.log('Estilistas cargados:', this.estilistas);
      },
      error: (error) => {
        console.error('Error al cargar estilistas:', error);
      }
    });
  }

  cargarServicios(): void {
    this.clienteService.obtenerServicios().subscribe({
      next: (data) => {
        this.servicios = data.respuesta.map((servicio: any) => ({
          id: servicio.id,
          nombre: servicio.nombre
        }));
        console.log('Servicios cargados:', this.servicios);
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
      }
    });
  }

  cargarHorariosOcupados(): void {  

    this.clienteService.obtenerCalendarioCitas().subscribe({
      next: (data) => {
        console.log('Datos recibidos del backend:', data.respuesta);
  
        this.horariosOcupados = data.respuesta.map((cita: CalendarioCitasDTO) => ({
          title: 'Cita ocupada',
          start: new Date(cita.fechaHoraInicio).toISOString(),
          end: new Date(cita.fechaHoraFin).toISOString(),
          backgroundColor: '#ff0000',
          borderColor: '#ff0000'
        }));
  
        console.log('Eventos generados para el calendario:', this.horariosOcupados);
  
        // Configurar el calendario con los eventos generados
        this.calendarOptions = {
          ...this.calendarOptions,
          events: this.horariosOcupados
        };
      },
      error: (error) => {
        console.error('Error al cargar horarios ocupados:', error);
      }
    });
  }

  seleccionarHorario(info: any): void {
    const fechaSeleccionada = new Date(info.start);
    const ahora = new Date();
    
    // Verificar si la fecha es anterior a hoy
    if (fechaSeleccionada < ahora) {
        alert('No se pueden agendar citas en fechas pasadas');
        return;
    }

    // Verificar si es el mismo día pero hora pasada
    if (fechaSeleccionada.toDateString() === ahora.toDateString() && 
        fechaSeleccionada.getHours() <= ahora.getHours()) {
        alert('No se pueden agendar citas en horas que ya pasaron');
        return;
    }
    
    // Verificar si el horario está dentro del horario de trabajo
    const hora = fechaSeleccionada.getHours();
    if (hora < 8 || hora >= 19) {
      alert('Por favor seleccione un horario entre las 8:00 AM y las 7:00 PM');
      return;
    }
  
    // Verificar si el horario está ocupado
    const horarioOcupado = this.horariosOcupados.some(cita => {
      const citaInicio = new Date(cita.start);
      const citaFin = new Date(cita.end);
      return fechaSeleccionada >= citaInicio && fechaSeleccionada < citaFin;
    });
  
    if (horarioOcupado) {
      alert('Este horario ya está ocupado. Por favor seleccione otro horario.');
      return;
    }
  
    // Formatear la fecha al formato esperado por el backend (yyyy-MM-dd HH:mm)
    const year = fechaSeleccionada.getFullYear();
    const month = String(fechaSeleccionada.getMonth() + 1).padStart(2, '0');
    const day = String(fechaSeleccionada.getDate()).padStart(2, '0');
    const hours = String(fechaSeleccionada.getHours()).padStart(2, '0');
    const minutes = String(fechaSeleccionada.getMinutes()).padStart(2, '0');
    
    this.cita.fechaHora = `${year}-${month}-${day} ${hours}:${minutes}`;
    
    // Mostrar confirmación al usuario
    alert(`Horario seleccionado: ${this.cita.fechaHora}`);
  }

  agendarCita(): void {
    if (!this.cita.estilistaId || !this.cita.servicioId || !this.cita.fechaHora) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }
  
    const crearCitaDTO: CrearCitaDTO = {
      idEstilista: this.cita.estilistaId,
      idServicio: this.cita.servicioId,
      idCliente: this.tokenService.getIDCuenta(),
      fechaHora: this.cita.fechaHora // Ahora la fecha está en el formato correcto
    };
  
    this.clienteService.agendarCita(crearCitaDTO).subscribe({
      next: (data) => {
        alert('Cita agendada con éxito');
        // Recargar los horarios ocupados después de agendar
        this.cargarHorariosOcupados();
        // Limpiar el formulario
        this.cita = {
          estilistaId: '',
          servicioId: '',
          fechaHora: ''
        };
      },
      error: (error) => {
        console.error('Error al agendar la cita:', error);
        alert('Error al agendar la cita: ' + (error.error?.mensaje || 'Por favor intente nuevamente'));
      }
    });
  }
}