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

/**
 * Componente para la pantalla de inicio de sesión
 * Maneja la autenticación de usuarios en la aplicación
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AlertMessagesModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;     // Formulario reactivo para los datos de inicio de sesión
  showPassword: boolean = false;   // Controla la visibilidad de la contraseña

  /**
   * Constructor del componente
   * @param formBuilder Servicio para crear formularios reactivos
   * @param publicoService Servicio para operaciones públicas como iniciar sesión
   * @param alertMessageService Servicio para mostrar mensajes de alerta
   * @param tokenService Servicio para gestionar el token de autenticación
   * @param router Servicio para navegación entre rutas
   */
  constructor(
    private formBuilder: FormBuilder,
    private publicoService: PublicoService,
    private alertMessageService: AlertMessagesService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],   // Campo para email con validaciones
      password: ['', Validators.required],                   // Campo para contraseña (¡CAMBIADO!)
    });
  }

  /**
   * Cambia la visibilidad de la contraseña entre texto plano y oculto
   * Permite al usuario ver lo que está escribiendo
   */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Método principal para manejar el inicio de sesión
   * Valida el formulario y envía la solicitud de autenticación al servidor
   */
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
      // Realiza la petición al servicio de autenticación
      this.publicoService.iniciarSesion(value).subscribe({
        next: (data) => {
          // Si la autenticación es exitosa, muestra mensaje de éxito
          Swal.fire({
            title: 'Inicio de Sesión',
            text: 'Ha iniciado sesión correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              // Almacena el token de autenticación recibido
              this.tokenService.login(data.respuesta.token);
            }
          });
        },
        error: (error) => {
          // En caso de error, muestra mensaje de error
          Swal.fire({
            title: 'Error',
            text: error.error.respuesta,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          }).then((result) => {
            // Si la cuenta no está activada, redirige a la página de activación
            if (result.isConfirmed && error.error.respuesta === 'Esta cuenta aún no ha sido activada') {
              this.router.navigate(['/activar-cuenta']);
            }
          });
        },
      });
    }
  }
}