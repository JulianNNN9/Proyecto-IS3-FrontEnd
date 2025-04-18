import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AlertMessagesModule, AlertMessagesService } from 'jjwins-angular-alert-messages';
import { CambiarContraseniaDTO } from '../../dto/cuenta/cambiar-contrasenia-dto';
import { ClienteService } from '../../services/cliente.service';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../services/token.service';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';

/**
 * Componente para cambiar la contraseña del usuario
 * Permite a usuarios modificar sus credenciales de acceso
 */
@Component({
  selector: 'app-cambiar-contrasenia',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, AlertMessagesModule],
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.css'],
})
export class CambiarContraseniaComponent {

  // Objeto para almacenar los datos del formulario
  contrasenia: CambiarContraseniaDTO = {
    idUsuario: '',
    contraseniaAntigua: '',
    contraseniaNueva: '',
    confirmarContraseniaNueva: ''
  };

  // Referencia al formulario en el HTML
  @ViewChild('cambiarContraseniaForm') cambiarContraseniaForm: NgForm;

  /**
   * Constructor del componente
   * @param router - Servicio para la navegación entre rutas
   * @param tokenService - Servicio para gestionar el token del usuario
   * @param cuentaService - Servicio para operaciones relacionadas con la cuenta del cliente
   * @param adminService - Servicio para operaciones administrativas
   * @param alertMessageService - Servicio para mostrar mensajes de alerta
   */
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private cuentaService: ClienteService,
    private adminService: AdminService,
    private alertMessageService: AlertMessagesService
  ) {}

  /**
   * Método principal para cambiar la contraseña del usuario
   * Valida los datos y realiza la petición al servidor correspondiente según el rol
   * @param cambiarContraseniaForm - Formulario con los datos de cambio de contraseña
   */
  public cambiarContrasenia(cambiarContraseniaForm: NgForm) {
    const { value, valid } = cambiarContraseniaForm;

    // Verifica que las contraseñas nuevas coincidan
    if (value.contraseniaNueva !== value.confirmarContraseniaNueva) {
      this.alertMessageService.show('Las contraseñas no coinciden',
        { cssClass: 'alerts-error', timeOut: 3000 }
      );
      return;
    }

    // Verifica que el formulario esté correctamente completado
    if (!valid) {
      this.alertMessageService.show('Por favor llena el formulario correctamente',
        { cssClass: 'alerts-error', timeOut: 3000 }
      );
    } else {
      // Asigna el ID del usuario obtenido del token
      this.cambiarContraseniaForm.value.idUsuario = this.tokenService.getIDCuenta();
      
      // Realiza diferentes acciones según el rol del usuario
      if (this.isCliente()) {
        // Petición al servicio para cambiar la contraseña del cliente
        this.cuentaService.cambiarContrasenia(value).subscribe({
          next: (data) => {
            // Muestra mensaje de éxito
            Swal.fire({
              title: 'Contraseña actualizada',
              text: data.respuesta,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            }).then(() => {
              // Redirecciona a la página de edición de cuenta
              this.router.navigate([`/editar-cuenta/${this.tokenService.getIDCuenta()}`]);
            });
          },
          error: (error) => {
            // Maneja errores en la petición
            Swal.fire({
              title: 'Error',
              text: error.error.mensaje || 'Hubo un error al cambiar la contraseña',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          },
        });
        // Limpia el formulario
        this.cambiarContraseniaForm.resetForm();
      } /*else if (this.isAdmin()) {
        // Código para cambiar contraseña de administrador (comentado)
      }*/
    }
  }

  /**
   * Verifica si el usuario ha iniciado sesión
   * @returns true si el usuario está autenticado, false en caso contrario
   */
  isLogged() {
    return this.tokenService.isLogged();
  }

  /**
   * Verifica si el usuario tiene rol de cliente
   * @returns true si el usuario es cliente, false en caso contrario
   */
  isCliente() {
    return this.isLogged() && this.tokenService.getRol() === 'CLIENTE';
  }

  /**
   * Verifica si el usuario tiene rol de administrador
   * @returns true si el usuario es administrador, false en caso contrario
   */
  isAdmin() {
    return this.isLogged() && this.tokenService.getRol() === 'ADMINISTRADOR';
  }
}