import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertMessagesModule } from 'jjwins-angular-alert-messages';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { ClienteService } from '../../services/cliente.service';
import { EditarUsuarioDTO } from '../../dto/cuenta/editar-usuario-dto';
import { MensajeDTO } from '../../dto/mensaje-dto';

/**
 * Componente para la gestión del perfil del usuario
 * Permite ver y editar información personal, cambiar contraseña y acceder a otras funciones
 */
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertMessagesModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PerfilComponent {
  opcionSeleccionada: string = 'editar-perfil'; // Opción seleccionada por defecto
  isAutorizado: boolean = true; // Controla si el usuario tiene autorización
  loggedInUser: string; // Almacena el ID del usuario autenticado
  perfil: any; // Objeto que almacena la información del perfil

  /**
   * Constructor del componente
   * @param router Servicio para navegación entre rutas
   * @param tokenService Servicio para gestionar el token de autenticación
   * @param clienteService Servicio para operaciones del cliente
   */
  constructor(private router: Router, private tokenService: TokenService, private clienteService: ClienteService) {
  }

  /**
   * Método que se ejecuta al inicializar el componente
   * Obtiene información del usuario autenticado y carga sus datos de perfil
   */
  ngOnInit() {
    // Verifica si el usuario está autenticado
    if (this.tokenService.isLogged()) {
      this.loggedInUser = this.tokenService.getIDCuenta();
      console.log('Usuario autenticado:', this.loggedInUser);
    }
    
    // Obtiene la información del usuario desde el servidor
    this.clienteService.obtenerInformacionUsuario(this.loggedInUser).subscribe({
      next: (InformacionUsuarioDTO) => {
        // Asigna los datos recibidos al objeto perfil
        this.perfil = {
          cedula: InformacionUsuarioDTO.cedula,
          nombreCompleto: InformacionUsuarioDTO.nombreCompleto,
          direccion: InformacionUsuarioDTO.direccion,
          telefono: InformacionUsuarioDTO.telefono,
          email: InformacionUsuarioDTO.email
        };
      },
      error: (err) => {
        console.error('Error al obtener la información del usuario:', err);
      }
    });
  }

  /**
   * Cambia entre las diferentes opciones del perfil
   * @param opcion Opción seleccionada (editar-perfil, cambiar-contrasena, etc.)
   */
  seleccionarOpcion(opcion: string) {
    this.opcionSeleccionada = opcion;
  }

  /**
   * Método principal para actualizar la información del perfil
   * Envía los datos modificados al servidor
   */
  actualizarPerfil() {
    // Crea un objeto con los datos a actualizar
    const editarUsuarioDTO: EditarUsuarioDTO = {
      idUsuario: this.loggedInUser,
      nombreCompleto: this.perfil.nombreCompleto,
      direccion: this.perfil.direccion,
      telefono: this.perfil.telefono
    };

    // Envía la solicitud al servidor
    this.clienteService.editarUsuario(editarUsuarioDTO).subscribe({
      next: (response: MensajeDTO<string>) => {
        console.log(response.respuesta);
        // Puedes mostrar un mensaje de éxito al usuario aquí
      },
      error: (err) => {
        console.error('Error al actualizar el perfil:', err);
        // Puedes mostrar un mensaje de error al usuario aquí
      }
    });
    
    // Lógica para actualizar el perfil

    
    console.log('Perfil actualizado:', this.perfil);
  }

  /**
   * Navega a la página de cambio de contraseña
   */
  cambiarContrasena() {
    // Lógica para cambiar la contraseña
    this.router.navigate(['/cambiar-contrasenia']);
  }

  /**
   * Navega a la página de quejas del usuario
   */
  irAMisQuejas() {
    this.router.navigate(['/mis-quejas']);
  }

  /**
   * Cierra la sesión del usuario actual
   * Elimina el token de autenticación
   */
  cerrarSesion() {
    this.tokenService.logout();
  }
}