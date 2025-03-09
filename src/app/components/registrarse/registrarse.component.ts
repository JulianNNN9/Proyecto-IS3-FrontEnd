import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PublicoService } from '../../services/publico.service';
import Swal from 'sweetalert2';
import { CrearUsuarioDTO } from '../../dto/crear-usuario-dto';
import { AlertMessagesService } from 'jjwins-angular-alert-messages';
import { AlertMessagesModule } from 'jjwins-angular-alert-messages';
import { Router } from '@angular/router';

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
  cliente: CrearUsuarioDTO = {
    cedula: '',
    nombreCompleto: '',
    direccion: '',
    telefono: '',
    email: '',
    contrasenia: '',
  };

  @ViewChild('clienteForm') clienteForm: NgForm;

  constructor(
    private publicoService: PublicoService,
    private alertMessageService: AlertMessagesService,
    private router: Router
  ) {}

  public registrar(clienteForm: NgForm) {
    console.log("Método registrar() ejecutado", clienteForm);
    const { value, valid, controls } = clienteForm;
    if (!valid) {
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
      this.publicoService.crearUsuario(value).subscribe({
        next: (data) => {
          Swal.fire({
            title: 'Cuenta creada',
            text: 'La cuenta se ha creado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error.error.respuesta,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        },
      });
      this.clienteForm.resetForm();
    }
  }
}