import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CrearSugerenciaDTO } from '../../dto/sugerencia/crear-sugerencia-dto'; // Asegúrate de tener el modelo correcto
import { MensajeDTO } from '../../dto/mensaje-dto'; // Asegúrate de importar el DTO de respuesta
import { ClienteService } from '../../services/cliente.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

/**
 * Componente para el envío de sugerencias por parte de los usuarios
 * Permite a los clientes proporcionar retroalimentación sobre el servicio
 */
@Component({
  selector: 'app-sugerencias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sugerencias.component.html',
  styleUrl: './sugerencias.component.css'
})
export class SugerenciasComponent {
  sugerenciasForm: FormGroup; // Formulario reactivo para capturar los datos de la sugerencia

  /**
   * Constructor del componente
   * @param fb Servicio para crear formularios reactivos
   * @param clienteService Servicio para operaciones del cliente
   * @param authService Servicio para gestionar la autenticación
   */
  constructor(private fb: FormBuilder, private clienteService: ClienteService, private authService: AuthService) {
    this.sugerenciasForm = this.fb.group({
      motivo: ['', Validators.required], // Campo obligatorio para el motivo de la sugerencia
      mensaje: ['', Validators.required] // Campo obligatorio para el mensaje de la sugerencia
    });
  }

  /**
   * Método principal para enviar la sugerencia
   * Se ejecuta cuando el usuario envía el formulario
   */
  onSubmit(): void {
    // Obtiene la información del usuario autenticado
    const usuario = this.authService.obtenerUsuarioAutenticado();
    
    // Verifica que el formulario sea válido antes de procesar
    if (this.sugerenciasForm.valid) {
      // Valida que exista un usuario autenticado
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
  
      // Envía la sugerencia al servidor utilizando el servicio
      this.clienteService.crearSugerencia(this.sugerenciasForm.value.motivo, this.sugerenciasForm.value.mensaje).subscribe({
        next: (response: MensajeDTO<string>) => {
          // Muestra mensaje de éxito si la sugerencia se envió correctamente
          Swal.fire({
            icon: 'success',
            title: 'Sugerencia enviada',
            text: 'Sugerencia creada correctamente',
            confirmButtonColor: '#3085d6'
          });
          this.sugerenciasForm.reset(); // Limpia el formulario después del envío exitoso
        },
        error: (error) => {
          // Muestra mensaje de error si hay un problema al enviar
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