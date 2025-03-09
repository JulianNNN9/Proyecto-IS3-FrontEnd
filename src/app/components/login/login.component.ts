import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PublicoService } from '../../services/publico.service';
import { AlertMessagesService } from 'jjwins-angular-alert-messages';
import { AlertMessagesModule } from 'jjwins-angular-alert-messages';
import Swal from 'sweetalert2';
import { TokenService } from '../../services/token.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AlertMessagesModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private publicoService: PublicoService,
    private alertMessageService: AlertMessagesService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      contrasenia: ['', Validators.required],
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    const { value, valid, controls } = this.loginForm;
    if (!valid) {
      console.log('Formulario inválido');
      // Crear un array para almacenar los campos inválidos
      const camposInvalidos = [];

      // Iterar sobre los controles del formulario
      for (const controlName in controls) {
        if (controls[controlName].invalid) {
          camposInvalidos.push(controlName);
        }
      }

      // Mostrar un mensaje de error con los campos inválidos
      this.alertMessageService.show(
        `Por favor llena el formulario correctamente. Campos inválidos: ${camposInvalidos.join(
          ', '
        )}`,
        { cssClass: 'alerts-error', timeOut: 4000 }
      );
      return;
    } else {
      console.log('Formulario válido');
      this.publicoService.iniciarSesion(value).subscribe({
        next: (data) => {
          Swal.fire({
            title: 'Inicio de Sesión',
            text: 'Ha iniciado sesión correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.tokenService.login(data.respuesta.token);
            }
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error.error.respuesta,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed && error.error.respuesta === 'Esta cuenta aún no ha sido activada') {
              this.router.navigate(['/activar-cuenta']);
            }
          });
        },
      });
    }
  }
}