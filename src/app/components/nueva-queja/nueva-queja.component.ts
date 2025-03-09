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

@Component({
  selector: 'app-nueva-queja',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AlertMessagesModule, RouterModule],
  templateUrl: './nueva-queja.component.html',
  styleUrls: ['./nueva-queja.component.css']
})
export class NuevaQuejaComponent implements OnInit {
  quejaForm: FormGroup;
  servicios = ['Corte de Cabello', 'Tinte', 'Alisado', 'Peinado']; // Ajusta según tus servicios
  estilistas = ['Ana Pérez', 'Carlos Gómez', 'Luisa Fernández', 'Pedro Ramírez']; // Ajusta según tu equipo

  constructor(
    private formBuilder: FormBuilder,
    private alertMessageService: AlertMessagesService,
    private router: Router
  ) {
    this.quejaForm = this.formBuilder.group({
      tipoServicio: ['', Validators.required],
      estilista: ['', Validators.required],  // Se agregó el estilista
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    // Se podrían cargar servicios y estilistas desde la API en el futuro
  }

  onSubmit() {
    if (this.quejaForm.valid) {
      const crearQuejaDTO: CrearQuejaDTO = {
        clienteId: '12345', // Cambiar por el ID del cliente actual
        descripcion: this.quejaForm.value.descripcion,
        fecha: new Date(),
        servicioId: this.quejaForm.value.tipoServicio,
        estilista: this.quejaForm.value.estilista // Se incluye el estilista seleccionado
      };

      // Aquí iría la lógica para enviar la queja a la API
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
    } else {
      this.alertMessageService.show('Formulario inválido', {
        cssClass: 'alerts-error',
        timeOut: 3000,
      });
    }
  }

  onClear() {
    this.quejaForm.reset();
  }
}
