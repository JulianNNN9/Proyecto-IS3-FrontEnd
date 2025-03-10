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

@Component({
  selector: 'app-nueva-queja',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AlertMessagesModule, RouterModule, CommonModule],
  templateUrl: './nueva-queja.component.html',
  styleUrls: ['./nueva-queja.component.css']
})
export class NuevaQuejaComponent implements OnInit {
  quejaForm: FormGroup;
  servicios: ServicioDTO[] = [];
  estilistas: EstilistaDTO[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private alertMessageService: AlertMessagesService,
    private router: Router,
    private clienteService: ClienteService,
    private authService: AuthService,
  ) {
    this.quejaForm = this.formBuilder.group({
      nombreServicio: ['', Validators.required],
      nombreEstilista: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.obtenerEstilistas();
    this.obtenerServicios();
  }

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
  

  onSubmit(): void {

    const usuario = this.authService.obtenerIdUsuario();
  
  
    if (this.quejaForm.valid) {

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
  
  
      this.clienteService.crearQueja(this.quejaForm.value.nombreServicio, this.quejaForm.value.nombreEstilista, this.quejaForm.value.descripcion).subscribe({
        next: (response: MensajeDTO<string>) => {
          Swal.fire({
            icon: 'success',
            title: 'Queja enviada',
            text: 'Queja creada correctamente',
            confirmButtonColor: '#3085d6'
          });
          this.quejaForm.reset();
        },
        error: (error) => {
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
  

  onClear() {
    this.quejaForm.reset();
  }
}
