import { Component, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertMessagesModule, AlertMessagesService } from 'jjwins-angular-alert-messages';
import { TokenService } from '../../services/token.service';
import { ClienteService } from '../../services/cliente.service';
import { EditarUsuarioDTO } from '../../dto/cuenta/editar-usuario-dto';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { InformacionUsuarioDTO } from '../../dto/cuenta/informacion-usuario-dto';
import { AdminService } from '../../services/admin.service';
import Swal from 'sweetalert2';

/**
 * Componente para la gestión del perfil del usuario
 * Permite ver y editar información personal, cambiar contraseña y acceder a otras funciones
 */
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, AlertMessagesModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PerfilComponent {
  opcionSeleccionada: string = 'editar-perfil'; // Opción seleccionada por defecto
  isAutorizado: boolean = true; // Controla si el usuario tiene autorización
  idUsuario: string; // Almacena el ID del usuario autenticado
  perfil: InformacionUsuarioDTO; // Objeto que almacena la información del perfil
  @ViewChild("editarCuentaForm") editarCuentaForm: NgForm;


  /**
   * Constructor del componente
   * @param router Servicio para navegación entre rutas
   * @param tokenService Servicio para gestionar el token de autenticación
   * @param clienteService Servicio para operaciones del cliente
   * @param alertMessageService Servicio para mostrar mensajes de alerta
   */
  constructor(
    private adminService: AdminService,
    private clienteService: ClienteService,
    private alertMessageService: AlertMessagesService,
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.perfil = {
      cedula: '',
      nombreCompleto: '',
      direccion: '',
      telefono: '',
      email: '',
    };
    this.route.params.subscribe((params: any) => {
      this.idUsuario = params['id'];
    });
    this.obtenerUsuario();
  }


  public obtenerUsuario() {
    if (this.isCliente()) {
      this.clienteService.obtenerInformacionUsuario(this.idUsuario).subscribe({
        next: (usuarioConsultado: MensajeDTO<InformacionUsuarioDTO>) => {
          if (usuarioConsultado) {
            this.perfil = {
              cedula: usuarioConsultado.respuesta.cedula,
              nombreCompleto: usuarioConsultado.respuesta.nombreCompleto,
              direccion: usuarioConsultado.respuesta.direccion,
              telefono: usuarioConsultado.respuesta.telefono,
              email: usuarioConsultado.respuesta.email,
            };
            if (
              this.isLogged() &&
              this.tokenService.getIDCuenta() === this.idUsuario
            ) {
              this.isAutorizado = true;
            }
          }
        },
        error: (error) => {
          this.alertMessageService.show(
            'Error al obtener la información del usuario',
            { cssClass: 'alerts-error', timeOut: 3000 }
          );
        },
      });
    } else if (this.isAdmin()) {
      this.adminService
        .obtenerInformacionUsuarioAdmin(this.idUsuario)
        .subscribe({
          next: (usuarioConsultado: MensajeDTO<InformacionUsuarioDTO>) => {
            if (usuarioConsultado) {
              this.perfil = {
                cedula: usuarioConsultado.respuesta.cedula,
                nombreCompleto: usuarioConsultado.respuesta.nombreCompleto,
                direccion: usuarioConsultado.respuesta.direccion,
                telefono: usuarioConsultado.respuesta.telefono,
                email: usuarioConsultado.respuesta.email,
              };
              if (
                this.isLogged() &&
                this.tokenService.getIDCuenta() === this.idUsuario
              ) {
                this.isAutorizado = true;
              }
            }
          },
          error: (error) => {
            this.alertMessageService.show(
              'Error al obtener la información del usuario',
              { cssClass: 'alerts-error', timeOut: 3000 }
            );
          },
        });
    }
  }

    /**
   * Método principal para actualizar la información del perfil
   * Envía los datos modificados al servidor
   */
  public editarCuenta(editarCuentaForm: NgForm) {
    const { value, valid } = editarCuentaForm;
  

    if (!valid) {
      this.alertMessageService.show('Por favor llena el formulario correctamente',
        { cssClass: 'alerts-error', timeOut: 3000 }
      );
    } else {
      const cuentaAEditar: EditarUsuarioDTO = {
        idUsuario: this.idUsuario,
        nombreCompleto: value.nombreCompleto,
        direccion: value.direccion,
        telefono: value.telefono
      };
      if(this.isCliente()){
        this.clienteService.editarUsuario(cuentaAEditar).subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Cuenta actualizada',
              text: data.respuesta,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text: error.error.respuesta || 'Hubo un error al actualizar la cuenta',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          },
        });

      }else if(this.isAdmin()){
        this.adminService.editarUsuarioAdmin(cuentaAEditar).subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Cuenta actualizada',
              text: data.respuesta,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text: error.error.respuesta || 'Hubo un error al actualizar la cuenta',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          },
        });

      }
    }
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

  isLogged() {
    return this.tokenService.isLogged();
  }
  isCliente() {
    return this.isLogged() && this.tokenService.getRol() === 'CLIENTE';
  }
  isAdmin() {
    return this.isLogged() && this.tokenService.getRol() === 'ADMINISTRADOR';
  }
}
