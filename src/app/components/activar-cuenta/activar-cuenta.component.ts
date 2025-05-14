import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PublicoService } from '../../services/publico.service';
import { CommonModule } from '@angular/common';

/**
 * Componente para la activación de cuentas de usuario
 * Permite a los usuarios activar sus cuentas con un código enviado por correo
 */
@Component({
  selector: 'app-activar-cuenta',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './activar-cuenta.component.html',
  styleUrl: './activar-cuenta.component.css'
})
export class ActivarCuentaComponent implements OnInit {
  // Formulario para capturar los datos de activación
  activarCuentaForm!: FormGroup;
  // Bandera para controlar el estado del proceso de reenvío
  resendInProgress = false;
  // Bandera para controlar el estado del proceso de activación
  isActivating = false;

  /**
   * Constructor del componente
   * @param fb - Servicio para crear formularios reactivos
   * @param publicoService - Servicio para operaciones con el backend
   * @param router - Servicio para navegación entre rutas
   */
  constructor(
    private fb: FormBuilder,
    private publicoService: PublicoService,
    private router: Router
  ) {}

  /**
   * Inicialización del componente
   * Configura el formulario con sus validaciones
   */
  ngOnInit(): void {
    this.activarCuentaForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Campo para email con validaciones
      codigoActivacion: ['', Validators.required], // Campo para código de activación
    });
  }

  /**
   * Método principal para activar la cuenta del usuario
   * Se ejecuta cuando el usuario envía el formulario con su código
   */
  onActivateAccount(): void {
    // Verifica si el formulario es válido
    if (this.activarCuentaForm.valid) {
      this.isActivating = true; // Activa el indicador de activación en curso
      console.log(this.activarCuentaForm.value);
      // Llama al servicio que comunica con el backend para activar la cuenta
      this.publicoService.activarCuenta(this.activarCuentaForm.value).subscribe({
        next: (response) => {
          this.isActivating = false; // Desactiva el indicador de activación
          // Muestra mensaje de éxito al usuario
          Swal.fire({
            title: 'Cuenta Activada',
            text: 'Su cuenta ha sido activada correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          // Redirecciona al login una vez activada la cuenta
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isActivating = false; // Desactiva el indicador de activación en caso de error
          // Manejo de errores con mensaje al usuario
          Swal.fire({
            title: 'Error',
            text: error.error.respuesta || 'No se pudo activar la cuenta.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }

  /**
   * Método para solicitar un nuevo código de activación
   * Útil cuando el código original ha expirado o se ha extraviado
   */
  onResendCode(): void {
    const email = this.activarCuentaForm.get('email')?.value;
    // Verifica que el email existe y es válido
    if (email && this.activarCuentaForm.get('email')?.valid) {
      this.resendInProgress = true; // Activa indicador de proceso en curso

      // Llama al servicio para solicitar un nuevo código de activación
      this.publicoService.enviarCodigoActivacion(email).subscribe({
        next: (response) => {
          // Mensaje de éxito al usuario
          Swal.fire({
            title: 'Código reenviado',
            text: 'Se ha enviado un nuevo código de activación a su correo.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.resendInProgress = false; // Desactiva indicador de proceso
        },
        error: (error) => {
          // Manejo de errores con mensaje al usuario
          Swal.fire({
            title: 'Error',
            text: error.error.respuesta || 'No se pudo reenviar el código.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          this.resendInProgress = false; // Desactiva indicador de proceso
        }
      });
    } else {
      // Alerta si el usuario no ha ingresado un email válido
      Swal.fire({
        title: 'Correo requerido',
        text: 'Ingrese un correo válido antes de solicitar un nuevo código.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    }
  }
}