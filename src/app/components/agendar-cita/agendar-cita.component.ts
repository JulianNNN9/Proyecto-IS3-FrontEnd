import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { CrearCitaDTO } from '../../dto/mis-citas/crear-cita-dto';
import { TokenService } from '../../services/token.service';
import { DatePipe } from '@angular/common'; // Importa DatePipe

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe], // Agrega DatePipe como proveedor
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

  constructor(
    private clienteService: ClienteService,
    private tokenService: TokenService,
    private datePipe: DatePipe // Inyecta DatePipe
  ) {}

  ngOnInit(): void {
    this.cargarEstilistas();
    this.cargarServicios();
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

  agendarCita(): void {
    // Reemplaza la 'T' por un espacio para cumplir con el formato esperado por el backend
    const fechaHoraFormateada = this.cita.fechaHora.replace('T', ' ');
  
    const crearCitaDTO: CrearCitaDTO = {
      idEstilista: this.cita.estilistaId,
      idServicio: this.cita.servicioId,
      idCliente: this.tokenService.getIDCuenta(), // Obtiene el ID del cliente desde el token
      fechaHora: fechaHoraFormateada // Envía el valor formateado
    };
  
    this.clienteService.agendarCita(crearCitaDTO).subscribe({
      next: (data) => {
        console.log('Cita agendada con éxito:', data.respuesta);
        alert('Cita agendada con éxito');
      },
      error: (error) => {
        console.error('Error al agendar la cita:', error);
        alert('Error al agendar la cita');
      }
    });
  }
}