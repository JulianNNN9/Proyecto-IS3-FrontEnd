import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicoService } from '../../services/publico.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

/**
 * Componente para recuperar contraseña olvidada
 * Permite a los usuarios restablecer su contraseña mediante un código de verificación
 */
@Component({
  selector: 'app-olvidar-contrasenia',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './olvidar-contrasenia.component.html',
  styleUrl: './olvidar-contrasenia.component.css'
})
export class OlvidarContraseniaComponent implements OnInit {
  olvidarContraseniaForm!: FormGroup; // Formulario para capturar los datos de recuperación
  resendInProgress = false; // Indica si hay una solicitud de reenvío en progreso
  isResetting = false; // Indica si el proceso de restablecimiento está en curso

  /**
   * Constructor del componente
   * @param fb - Constructor de formularios
   * @param publicoService - Servicio para operaciones públicas como recuperación de contraseña
   * @param router - Servicio para navegación entre rutas
   */
  constructor(
    private fb: FormBuilder,
    private publicoService: PublicoService,
    private router: Router
  ) {}

  /**
   * Inicializa el componente y configura el formulario con validaciones
   */
  ngOnInit(): void {
    this.olvidarContraseniaForm = this.fb.group({
      correoUsuario: ['', [Validators.required, Validators.email]], // Email con validaciones
      codigoVerificacion: ['', Validators.required], // Código recibido por email
      contraseniaNueva: [
        '',
        [
          Validators.required,
          Validators.minLength(8), // Mínimo 8 caracteres
          Validators.maxLength(24), // Máximo 24 caracteres
          Validators.pattern(/^[A-Z].*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/) // Debe comenzar con mayúscula y contener caracteres especiales
        ]
      ],
      confirmarContraseniaNueva: ['', [Validators.required]] // Campo para confirmar contraseña
    });
  }

  /**
   * Método principal para restablecer la contraseña
   * Valida el formulario, compara las contraseñas y realiza la petición al servidor
   */
  onResetPassword(): void {
    // Verifica si el formulario es válido
    if (this.olvidarContraseniaForm.valid) {
      this.isResetting = true; // Indica que el proceso de restablecimiento ha comenzado
      const formValue = this.olvidarContraseniaForm.value;
      // Verifica que las contraseñas coincidan
      if (formValue.contraseniaNueva !== formValue.confirmarContraseniaNueva) {
        Swal.fire({
          title: 'Error',
          text: 'Las contraseñas no coinciden.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        this.isResetting = false; // Indica que el proceso de restablecimiento ha terminado (con error)
        return;
      }

      // Envía la solicitud para restablecer la contraseña
      this.publicoService.recuperarContrasenia(formValue).subscribe({
        next: (response) => {
          this.isResetting = false; // Indica que el proceso de restablecimiento ha terminado
          // Muestra mensaje de éxito y redirige al login
          Swal.fire({
            title: 'Contraseña Restablecida',
            text: response.respuesta,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (error) => {
          this.isResetting = false; // Indica que el proceso de restablecimiento ha terminado (con error)
          // Muestra mensaje de error
          Swal.fire({
            title: 'Error',
            text: error.error.respuesta || 'No se pudo restablecer la contraseña.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }

  /**
   * Solicita un nuevo código de verificación
   * Valida que se haya ingresado un correo electrónico válido
   */
  onResendCode(): void {
    const email = this.olvidarContraseniaForm.get('correoUsuario')?.value;
    if (email && this.olvidarContraseniaForm.get('correoUsuario')?.valid) {
      this.resendInProgress = true; // Indica que hay una solicitud en progreso

      // Envía la solicitud para obtener un nuevo código
      this.publicoService.enviarCodigoRecuperacion(email).subscribe({
        next: (response) => {
          // Muestra mensaje de éxito
          Swal.fire({
            title: 'Código reenviado',
            text: response.respuesta,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.resendInProgress = false; // Finaliza el indicador de progreso
        },
        error: (error) => {
          // Muestra mensaje de error
          Swal.fire({
            title: 'Error',
            text: error.error.respuesta || 'No se pudo reenviar el código.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          this.resendInProgress = false; // Finaliza el indicador de progreso
        }
      });
    } else {
      // Alerta si no se ha proporcionado un email válido
      Swal.fire({
        title: 'Correo requerido',
        text: 'Ingrese un correo válido antes de solicitar un nuevo código.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    }
  }
}