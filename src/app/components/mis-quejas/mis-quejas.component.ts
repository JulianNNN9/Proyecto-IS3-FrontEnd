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
  styleUrls: ['./mis-quejas.component.css']
})
export class MisQuejasComponent implements OnInit {
  quejas: any[] = [];      // Arreglo que almacena las quejas del usuario
  usuarioId: number = 1;   // ID del usuario, valor por defecto (debería obtenerse del token)

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
    this.cargarQuejas();
  }

  /**
   * Método principal para obtener las quejas del usuario desde el servidor
   * Utiliza el ID obtenido del token para recuperar solo las quejas asociadas al usuario actual
   */
  cargarQuejas(): void {
    // Muestra en consola el ID de cuenta recuperado del token
    console.log(this.tokenService.getIDCuenta())

    // Llama al servicio para obtener las quejas del cliente por su ID
    this.clienteService.obtenerQuejasPorClienteId(this.tokenService.getIDCuenta()).subscribe({
      next: (data) => {
        // Almacena las quejas recibidas en la propiedad del componente
        this.quejas = data.respuesta;
        console.log('Quejas cargadas:', this.quejas);
      },
      error: (error) => {
        // Manejo de errores en la petición
        console.error('Error al obtener quejas:', error);
      }
    });
  }
}