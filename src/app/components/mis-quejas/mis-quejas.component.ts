import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';
import { HttpClientModule } from '@angular/common/http';
import { TokenService } from '../../services/token.service';
import { DatePipe } from '@angular/common';
import { QuejaDTO } from '../../dto/queja/queja-dto';

/**
 * Componente para visualizar las quejas del usuario actual
 * Muestra un listado de las quejas que ha presentado el cliente
 */
@Component({
  selector: 'app-mis-quejas',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [DatePipe],
  templateUrl: './mis-quejas.component.html',
  styleUrls: ['./mis-quejas.component.css'],
})
export class MisQuejasComponent implements OnInit {
  quejas: QuejaDTO[] = []; // Arreglo que almacena las quejas del usuario

  // Variables para el modal de detalle
  textoDetalle: string = '';
  tituloDetalle: string = 'Respuesta completa';
  nombreServicio: string = '';
  nombreEstilista: string = '';
  fechaRespuesta: Date | null = null; // Fecha de la respuesta

  constructor(
    private clienteService: ClienteService,
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
        this.cargarQuejas(id);
      }
      if (++intentos >= maxIntentos) {
        console.error('No se pudo obtener el ID del token tras varios intentos.');
        clearInterval(interval);
      }
    }, 100);
  }

  cargarQuejas(idCliente: string): void {
    console.log('ID del cliente:', idCliente);

    this.clienteService.obtenerQuejasPorClienteId(idCliente).subscribe({
      next: (data) => {
        this.quejas = data.respuesta;
        console.log('Quejas cargadas:', this.quejas);
      },
      error: (error) => {
        console.error('Error al obtener quejas:', error);
      },
    });
  }

  /**
   * Abre el modal de detalle con la información correspondiente
   * @param texto Contenido a mostrar
   * @param titulo Título del modal
   * @param servicio Nombre del servicio
   * @param estilista Nombre del estilista
   * @param fecha Fecha de la respuesta (opcional)
   */
  verDetalle(
    texto: string,
    titulo: string,
    servicio: string,
    estilista: string,
    fecha?: Date
  ): void {
    this.textoDetalle = texto;
    this.tituloDetalle = titulo;
    this.nombreServicio = servicio;
    this.nombreEstilista = estilista;
    this.fechaRespuesta = fecha || null;

    const modal = document.getElementById('modalVerDetalle');
    if (modal) {
      const modalBootstrap = new (window as any).bootstrap.Modal(modal);
      modalBootstrap.show();
    }
  }
}