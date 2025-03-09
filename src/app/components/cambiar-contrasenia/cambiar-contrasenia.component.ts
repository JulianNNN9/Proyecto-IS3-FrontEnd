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

@Component({
  selector: 'app-cambiar-contrasenia',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, AlertMessagesModule],
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.css'],
})
export class CambiarContraseniaComponent {

  contrasenia: CambiarContraseniaDTO = {
    idUsuario: '',
    contraseniaAntigua: '',
    contraseniaNueva: '',
    confirmarContraseniaNueva: ''
  };

  @ViewChild('cambiarContraseniaForm') cambiarContraseniaForm: NgForm;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private cuentaService: ClienteService,
    private adminService: AdminService,
    private alertMessageService: AlertMessagesService
  ) {}

  public cambiarContrasenia(cambiarContraseniaForm: NgForm) {
    const { value, valid } = cambiarContraseniaForm;

    if (value.contraseniaNueva !== value.confirmarContraseniaNueva) {
      this.alertMessageService.show('Las contraseñas no coinciden',
        { cssClass: 'alerts-error', timeOut: 3000 }
      );
      return;
    }

    if (!valid) {
      this.alertMessageService.show('Por favor llena el formulario correctamente',
        { cssClass: 'alerts-error', timeOut: 3000 }
      );
    } else {
      this.cambiarContraseniaForm.value.idUsuario = this.tokenService.getIDCuenta();
      if (this.isCliente()) {
        this.cuentaService.cambiarContrasenia(value).subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Contraseña actualizada',
              text: data.respuesta,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            }).then(() => {
              this.router.navigate([`/editar-cuenta/${this.tokenService.getIDCuenta()}`]);
            });
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text: error.error.mensaje || 'Hubo un error al cambiar la contraseña',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          },
        });
        this.cambiarContraseniaForm.resetForm();
      } /*else if (this.isAdmin()) {
        this.adminService.cambiarContraseniaAdmin(value).subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Contraseña actualizada',
              text: data.mensaje,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            }).then(() => {
              this.router.navigate([`/editar-cuenta/${this.tokenService.getIDCuenta()}`]);
            });
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text: error.error.mensaje || 'Hubo un error al cambiar la contraseña',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          },
        });
        this.cambiarContraseniaForm.resetForm();
      }*/
    }
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