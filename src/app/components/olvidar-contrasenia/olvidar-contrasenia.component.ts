import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicoService } from '../../services/publico.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-olvidar-contrasenia',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './olvidar-contrasenia.component.html',
  styleUrl: './olvidar-contrasenia.component.css'
})
export class OlvidarContraseniaComponent {
  olvidarContraseniaForm!: FormGroup;
  resendInProgress = false;

  constructor(
    private fb: FormBuilder,
    private publicoService: PublicoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.olvidarContraseniaForm = this.fb.group({
      correoUsuario: ['', [Validators.required, Validators.email]],
      codigoVerificacion: ['', Validators.required],
      contraseniaNueva: [
        '', 
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(24),
          Validators.pattern(/^[A-Z].*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)
        ]
      ],
      confirmarContraseniaNueva: ['', [Validators.required]]
    });
  }

  onResetPassword(): void {
    if (this.olvidarContraseniaForm.valid) {
      const formValue = this.olvidarContraseniaForm.value;
      if (formValue.contraseniaNueva !== formValue.confirmarContraseniaNueva) {
        Swal.fire({
          title: 'Error',
          text: 'Las contraseñas no coinciden.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      this.publicoService.recuperarContrasenia(formValue).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Contraseña Restablecida',
            text: response.respuesta,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
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

  onResendCode(): void {
    const email = this.olvidarContraseniaForm.get('correoUsuario')?.value;
    if (email && this.olvidarContraseniaForm.get('correoUsuario')?.valid) {
      this.resendInProgress = true;
      this.publicoService.enviarCodigoRecuperacion(email).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Código reenviado',
            text: response.respuesta,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.resendInProgress = false;
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error.error.respuesta || 'No se pudo reenviar el código.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          this.resendInProgress = false;
        }
      });
    } else {
      Swal.fire({
        title: 'Correo requerido',
        text: 'Ingrese un correo válido antes de solicitar un nuevo código.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    }
  }
}