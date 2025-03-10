import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CrearSugerenciaDTO } from '../../dto/sugerencia/crear-sugerencia-dto'; // Asegúrate de tener el modelo correcto
import { MensajeDTO } from '../../dto/mensaje-dto'; // Asegúrate de importar el DTO de respuesta
import { ClienteService } from '../../services/cliente.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-sugerencias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sugerencias.component.html',
  styleUrl: './sugerencias.component.css'
})
export class SugerenciasComponent {
  sugerenciasForm: FormGroup;

  constructor(private fb: FormBuilder, private clienteService: ClienteService, private authService: AuthService) {
    this.sugerenciasForm = this.fb.group({
      motivo: ['', Validators.required],
      mensaje: ['', Validators.required]
    });
  }

  onSubmit(): void {

    const usuario = this.authService.obtenerUsuarioAutenticado();
    

    if (this.sugerenciasForm.valid) {
      const usuario = this.authService.obtenerUsuarioAutenticado();
  
      if (!usuario) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener la información del usuario. Intenta iniciar sesión nuevamente.',
          confirmButtonColor: '#d33'
        });
        return;
      }

      console.log('Usuario autenticado:', usuario.email);
  
      this.clienteService.crearSugerencia(this.sugerenciasForm.value.motivo, this.sugerenciasForm.value.mensaje).subscribe({
        next: (response: MensajeDTO<string>) => {
          Swal.fire({
            icon: 'success',
            title: 'Sugerencia enviada',
            text: 'Sugerencia creada correctamente',
            confirmButtonColor: '#3085d6'
          });
          this.sugerenciasForm.reset();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al enviar la sugerencia. Inténtalo de nuevo.',
            confirmButtonColor: '#d33'
          });
          console.error('Error al enviar la sugerencia:', error);
        }
      });
    }
  }
  
}