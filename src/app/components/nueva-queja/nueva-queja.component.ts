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
import { CrearQuejaDTO } from '../../dto/queja/crear-queja-dto';
;

@Component({
  selector: 'app-nueva-queja',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AlertMessagesModule, RouterModule],
  templateUrl: './nueva-queja.component.html',
  styleUrls: ['./nueva-queja.component.css']
})
export class NuevaQuejaComponent implements OnInit {
  quejaForm: FormGroup;
  servicios = ['Servicio 1', 'Servicio 2', 'Servicio 3']; // Ajusta según tus servicios

  constructor(
    private formBuilder: FormBuilder,
    private alertMessageService: AlertMessagesService,
    //private clienteService: ClienteService,
    private router: Router
  ) {
    this.quejaForm = this.formBuilder.group({
      tipoServicio: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    // Agregar los tipos de servicio que se ofrecen
  }

  onSubmit() {
    /*if (this.quejaForm.valid) {
      const crearQuejaDTO: CrearQuejaDTO = {
        clienteId: '12345', // Cambiar por el ID del cliente actual
        descripcion: this.quejaForm.value.descripcion,
        fecha: new Date(),
        servicioId: this.quejaForm.value.tipoServicio
      };

      this.clienteService.crearQueja(crearQuejaDTO).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Queja enviada',
            text: 'Tu queja ha sido enviada correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/mis-quejas']);
            }
          });
        },
        error: (error) => {
          this.alertMessageService.show('Error al enviar la queja', {
            cssClass: 'alerts-error',
            timeOut: 3000,
          });
        }
      });
    } else {
      this.alertMessageService.show('Formulario inválido', {
        cssClass: 'alerts-error',
        timeOut: 3000,
      });
    }*/
  }

  onClear() {
    this.quejaForm.reset();
  }
}