import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';
import { HttpClientModule } from '@angular/common/http';
import { TokenService } from '../../services/token.service';

/**
 * Componente para visualizar las quejas del usuario actual
 * Muestra un listado de las quejas que ha presentado el cliente
 */
@Component({
  selector: 'app-mis-quejas',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './mis-quejas.component.html',
  styleUrls: ['./mis-quejas.component.css'],
})
export class MisQuejasComponent {
  quejas: any[] = []; // Arreglo que almacena las quejas del usuario
  usuarioId: number = 1; // ID del usuario, valor por defecto (debería obtenerse del token)

  /**
   * Constructor del componente
   * @param clienteService Servicio para acceder a las operaciones de cliente
   * @param tokenService Servicio para obtener información del token de autenticación
   */
  constructor(
    private clienteService: ClienteService,
    private tokenService: TokenService
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente
   * Llama al método para cargar las quejas del usuario
   */
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

  /**
   * Método principal para obtener las quejas del usuario desde el servidor
   * Utiliza el ID proporcionado para recuperar solo las quejas asociadas al usuario actual
   */
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
}
