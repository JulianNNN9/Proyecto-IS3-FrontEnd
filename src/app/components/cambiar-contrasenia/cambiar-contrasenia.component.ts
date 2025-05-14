import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AlertMessagesModule, AlertMessagesService } from 'jjwins-angular-alert-messages';
import { CambiarContraseniaDTO } from '../../dto/cuenta/cambiar-contrasenia-dto';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { ClienteService } from '../../services/cliente.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-cambiar-contrasenia',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, AlertMessagesModule],
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.css'],
})
export class CambiarContraseniaComponent {

  // Objeto para almacenar los datos del formulario de cambio de contraseña
  contrasenia: CambiarContraseniaDTO = {
    idUsuario: '',
    contraseniaAntigua: '',
    contraseniaNueva: '',
    confirmarContraseniaNueva: ''
  };

  // Referencia al formulario HTML
  @ViewChild('cambiarContraseniaForm') cambiarContraseniaForm: NgForm;

  // Propiedad para controlar el estado de carga
  isLoading: boolean = false;

  // Constructor del componente, inyecta los servicios necesarios
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private cuentaService: ClienteService,
    private adminService: AdminService,
    private alertMessageService: AlertMessagesService
  ) {}

  // Método que se llama al enviar el formulario de cambio de contraseña
  public cambiarContrasenia(cambiarContraseniaForm: NgForm) {
    // Obtiene los valores del formulario y su estado de validez
    const { value, valid } = cambiarContraseniaForm;

    // Verifica si la nueva contraseña y su confirmación coinciden
    if (value.contraseniaNueva !== value.confirmarContraseniaNueva) {
      // Muestra un mensaje de error si no coinciden
      this.alertMessageService.show('Las contraseñas no coinciden',
        { cssClass: 'alerts-error', timeOut: 3000 }
      );
      return; // Detiene la ejecución del método
    }

    // Verifica si el formulario es válido
    if (!valid) {
      // Muestra un mensaje de error si el formulario no es válido
      this.alertMessageService.show('Por favor llena el formulario correctamente',
        { cssClass: 'alerts-error', timeOut: 3000 }
      );
    } else {
      this.isLoading = true; // Establece isLoading a true al iniciar la petición

      // Asigna el ID del usuario al objeto de contraseña
      this.cambiarContraseniaForm.value.idUsuario = this.tokenService.getIDCuenta();

      // Determina si el usuario es un cliente
      if (this.isCliente()) {
        // Llama al servicio para cambiar la contraseña del cliente
        this.cuentaService.cambiarContrasenia(value).subscribe({
          next: (data) => {
            this.isLoading = false; // Establece isLoading a false al recibir la respuesta
            // Muestra un mensaje de éxito con la respuesta del servidor
            Swal.fire({
              title: 'Contraseña actualizada',
              text: data.respuesta,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            }).then(() => {
              // Redirige al usuario a la página de edición de cuenta
              this.router.navigate([`/editar-cuenta/${this.tokenService.getIDCuenta()}`]);
            });
          },
          error: (error) => {
            this.isLoading = false; // Establece isLoading a false en caso de error
            // Muestra un mensaje de error con la respuesta del servidor o un mensaje genérico
            Swal.fire({
              title: 'Error',
              text: error.error.respuesta || 'Hubo un error al cambiar la contraseña',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          },
        });
        this.cambiarContraseniaForm.resetForm(); // Limpia el formulario después del envío
      } else if (this.isAdmin()) {
        // Llama al servicio para cambiar la contraseña del administrador
        this.adminService.cambiarContraseniaAdmin(value).subscribe({
          next: (data) => {
            this.isLoading = false; // Establece isLoading a false al recibir la respuesta
            // Muestra un mensaje de éxito con la respuesta del servidor
            Swal.fire({
              title: 'Contraseña actualizada',
              text: data.respuesta,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            }).then(() => {
              // Redirige al usuario a la página de edición de cuenta
              this.router.navigate([`/editar-cuenta/${this.tokenService.getIDCuenta()}`]);
            });
          },
          error: (error) => {
            this.isLoading = false; // Establece isLoading a false en caso de error
            // Muestra un mensaje de error con la respuesta del servidor o un mensaje genérico
            Swal.fire({
              title: 'Error',
              text: error.error.respuesta || 'Hubo un error al cambiar la contraseña',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          },
        });
        this.cambiarContraseniaForm.resetForm(); // Limpia el formulario después del envío
      }
    }
  }

  // Método para verificar si el usuario está logueado
  isLogged() {
    return this.tokenService.isLogged();
  }

  // Método para verificar si el usuario tiene el rol de CLIENTE
  isCliente(){
    return this.isLogged() && this.tokenService.getRol() === 'CLIENTE';
  }

  // Método para verificar si el usuario tiene el rol de ADMINISTRADOR
  isAdmin(){
    return this.isLogged() && this.tokenService.getRol() === 'ADMIN';
  }
}