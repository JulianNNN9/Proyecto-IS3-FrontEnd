import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PublicoService } from '../../services/publico.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activar-cuenta',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './activar-cuenta.component.html',
  styleUrl: './activar-cuenta.component.css'
})
export class ActivarCuentaComponent {
  activarCuentaForm!: FormGroup;
  resendInProgress = false;

  constructor(
    private fb: FormBuilder,
    private publicoService: PublicoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activarCuentaForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      codigoActivacion: ['', Validators.required],
    });
  }

  // Método para activar la cuenta con el código
  onActivateAccount(): void {
    if (this.activarCuentaForm.valid) {
      console.log(this.activarCuentaForm.value);
      this.publicoService.activarCuenta(this.activarCuentaForm.value).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Cuenta Activada',
            text: 'Su cuenta ha sido activada correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
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

  onResendCode(): void {
    const email = this.activarCuentaForm.get('email')?.value;
    if (email && this.activarCuentaForm.get('email')?.valid) {
      this.resendInProgress = true;
      this.publicoService.enviarCodigoActivacion(email).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Código reenviado',
            text: 'Se ha enviado un nuevo código de activación a su correo.',
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