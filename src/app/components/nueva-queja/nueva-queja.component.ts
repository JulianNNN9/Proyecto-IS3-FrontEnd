import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { AlertMessagesService } from 'jjwins-angular-alert-messages';
import { AlertMessagesModule } from 'jjwins-angular-alert-messages';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { CrearQuejaDTO } from '../../dto/queja/crear-queja-dto';
import { ServicioDTO } from '../../dto/servicio/servicio-dto';
import { EstilistaDTO } from '../../dto/estilista/estilista-dto';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { AuthService } from '../../services/auth.service';

/**
 * Componente para la creación de nuevas quejas
 * Permite a los usuarios registrar sus inconformidades con los servicios recibidos
 */
@Component({
  selector: 'app-nueva-queja',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AlertMessagesModule, RouterModule, CommonModule],
  templateUrl: './nueva-queja.component.html',
  styleUrls: ['./nueva-queja.component.css']
})
export class NuevaQuejaComponent implements OnInit {
  quejaForm: FormGroup;       // Formulario reactivo para capturar los datos de la queja
  servicios: ServicioDTO[] = []; // Lista de servicios disponibles para seleccionar
  estilistas: EstilistaDTO[] = []; // Lista de estilistas disponibles para seleccionar

  /**
   * Constructor del componente
   * @param formBuilder Servicio para crear formularios reactivos
   * @param alertMessageService Servicio para mostrar mensajes de alerta
   * @param router Servicio para navegación entre rutas
   * @param clienteService Servicio para operaciones del cliente
   * @param authService Servicio para obtener información del usuario autenticado
   */
  constructor(
    private formBuilder: FormBuilder,
    private alertMessageService: AlertMessagesService,
    private router: Router,
    private clienteService: ClienteService,
    private authService: AuthService,
  ) {
    this.quejaForm = this.formBuilder.group({
      nombreServicio: ['', Validators.required],  // Campo obligatorio para el nombre del servicio
      nombreEstilista: ['', Validators.required], // Campo obligatorio para el nombre del estilista
      descripcion: ['', [Validators.required, Validators.minLength(10)]] // Campo obligatorio con mínimo 10 caracteres
    });
  }

  /**
   * Método que se ejecuta al inicializar el componente
   * Carga las listas de estilistas y servicios disponibles
   */
  ngOnInit() {
    this.obtenerEstilistas();
    this.obtenerServicios();
  }

  /**
   * Obtiene la lista de servicios disponibles desde el servidor
   * Actualiza la propiedad servicios con la respuesta
   */
  obtenerServicios() {
    this.clienteService.obtenerServicios().subscribe(
      (data) => {
        if (data.respuesta) {
          this.servicios = data.respuesta;
        } else {
          console.error('Error: Respuesta de servicios vacía o inválida');
        }
      },
      (error) => {
        console.error('Error obteniendo servicios', error);
      }
    );
  }

  /**
   * Obtiene la lista de estilistas disponibles desde el servidor
   * Actualiza la propiedad estilistas con la respuesta
   */
  obtenerEstilistas() {
    this.clienteService.obtenerEstilistas().subscribe(
      (data) => {
        if (data.respuesta) {
          this.estilistas = data.respuesta;
        } else {
          console.error('Error: Respuesta de estilistas vacía o inválida');
        }
      },
      (error) => {
        console.error('Error obteniendo estilistas', error);
      }
    );
  }
  
  /**
   * Método principal para enviar la queja al servidor
   * Valida el formulario y la autenticación del usuario antes de enviar
   */
  onSubmit(): void {
    // Obtiene información del usuario autenticado
    const usuario = this.authService.obtenerIdUsuario();
  
    // Valida que el formulario esté correctamente completado
    if (this.quejaForm.valid) {
      // Verifica que exista un usuario autenticado
      if (!usuario) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener la información del usuario. Intenta iniciar sesión nuevamente.',
          confirmButtonColor: '#d33'
        });
        return;
      }
      
      console.log('Usuario autenticado:', usuario.id);
  
      // Envía la queja al servidor utilizando el servicio
      this.clienteService.crearQueja(this.quejaForm.value.nombreServicio, this.quejaForm.value.nombreEstilista, this.quejaForm.value.descripcion).subscribe({
        next: (response: MensajeDTO<string>) => {
          // Muestra mensaje de éxito si la operación fue correcta
          Swal.fire({
            icon: 'success',
            title: 'Queja enviada',
            text: 'Queja creada correctamente',
            confirmButtonColor: '#3085d6'
          });
          this.quejaForm.reset(); // Limpia el formulario
        },
        error: (error) => {
          // Muestra mensaje de error si la operación falló
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al enviar la queja. Inténtalo de nuevo.',
            confirmButtonColor: '#d33'
          });
          console.error('Error al enviar la queja:', error);
        }
      });
    }
  }
  
  /**
   * Limpia el formulario, eliminando todos los datos ingresados
   */
  onClear() {
    this.quejaForm.reset();
  }
}