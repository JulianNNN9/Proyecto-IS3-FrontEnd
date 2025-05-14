import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PublicoService } from '../../services/publico.service';
import Swal from 'sweetalert2';
import { CrearUsuarioDTO } from '../../dto/crear-usuario-dto';
import { AlertMessagesService, AlertMessagesModule } from 'jjwins-angular-alert-messages';
import { Router } from '@angular/router';

/**
 * Componente para el registro de nuevos usuarios
 * Permite crear cuentas de cliente en la aplicación
 */
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AlertMessagesModule,
  ],
  templateUrl: './registrarse.component.html',
  styleUrl: './registrarse.component.css',
})
export class RegistrarseComponent {
  /**
   * Objeto que almacena los datos del formulario de registro
   * Contiene los campos necesarios para crear un nuevo usuario
   */
  cliente: CrearUsuarioDTO = {
    cedula: '',
    nombreCompleto: '',
    direccion: '',
    telefono: '',
    email: '',
    contrasenia: '',
  };

  /**
   * Referencia al formulario de registro en la plantilla
   * Permite acceder a sus propiedades y métodos
   */
  @ViewChild('clienteForm') clienteForm: NgForm;

  /**
   * Propiedad para controlar el estado de carga
   */
  isLoading: boolean = false;

  /**
   * Constructor del componente
   * @param publicoService Servicio para realizar operaciones públicas como registro de usuarios
   * @param alertMessageService Servicio para mostrar mensajes de alerta
   * @param router Servicio para la navegación entre rutas
   */
  constructor(
    private publicoService: PublicoService,
    private alertMessageService: AlertMessagesService,
    private router: Router
  ) {}

  /**
   * Método principal para registrar un nuevo usuario
   * Valida el formulario y envía los datos al servidor
   * @param clienteForm Formulario con los datos del cliente a registrar
   */
  public registrar(clienteForm: NgForm) {
    if (clienteForm.invalid) {
      console.log('Formulario inválido');
      // Crear un array para almacenar los campos inválidos
      const camposInvalidos = [];

      // Iterar sobre los controles del formulario
      for (const controlName in clienteForm.controls) {
        if (clienteForm.controls[controlName].invalid) {
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
      this.isLoading = true; // Establecer isLoading a true al iniciar la petición
      // Si el formulario es válido, envía la solicitud de registro
      this.publicoService.crearUsuario(clienteForm.value).subscribe({
        next: (data) => {
          this.isLoading = false; // Establecer isLoading a false al recibir la respuesta
          // Muestra mensaje de éxito si el registro es exitoso
          Swal.fire({
            title: 'Cuenta creada',
            text: 'La cuenta se ha creado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
          // Redirige al usuario a la página de inicio de sesión
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false; // Establecer isLoading a false en caso de error
          // Muestra mensaje de error si falla el registro
          Swal.fire({
            title: 'Error',
            text: error.error.respuesta,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        },
      });
      // Limpia el formulario después del envío
      this.clienteForm.resetForm();
    }
  }
}