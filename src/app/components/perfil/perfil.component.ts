import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertMessagesModule } from 'jjwins-angular-alert-messages';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { ClienteService } from '../../services/cliente.service';
import { EditarUsuarioDTO } from '../../dto/cuenta/editar-usuario-dto';
import { MensajeDTO } from '../../dto/mensaje-dto';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertMessagesModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PerfilComponent {
  opcionSeleccionada: string = 'editar-perfil';
  isAutorizado: boolean = true; // Cambia esto según la lógica de autorización
  loggedInUser: string;
  perfil: any

  constructor(private router: Router, private tokenService: TokenService, private clienteService: ClienteService) {
  }

  ngOnInit() {
    if (this.tokenService.isLogged()) {
      this.loggedInUser = this.tokenService.getIDCuenta();
      console.log('Usuario autenticado:', this.loggedInUser);
    }
    this.clienteService.obtenerInformacionUsuario(this.loggedInUser).subscribe({
      
      next: (InformacionUsuarioDTO) => {
        this.perfil = {
          cedula: InformacionUsuarioDTO.cedula,
          nombreCompleto: InformacionUsuarioDTO.nombreCompleto,
          direccion: InformacionUsuarioDTO.direccion,
          telefono: InformacionUsuarioDTO.telefono,
          email: InformacionUsuarioDTO.email
        };
      },
      error: (err) => {
        console.error('Error al obtener la información del usuario:', err);
      }
    });
  }

  seleccionarOpcion(opcion: string) {
    this.opcionSeleccionada = opcion;
  }

  actualizarPerfil() {
    const editarUsuarioDTO: EditarUsuarioDTO = {
      idUsuario: this.loggedInUser,
      nombreCompleto: this.perfil.nombreCompleto,
      direccion: this.perfil.direccion,
      telefono: this.perfil.telefono
    };

    this.clienteService.editarUsuario(editarUsuarioDTO).subscribe({
      next: (response: MensajeDTO<string>) => {
        console.log(response.respuesta);
        // Puedes mostrar un mensaje de éxito al usuario aquí
      },
      error: (err) => {
        console.error('Error al actualizar el perfil:', err);
        // Puedes mostrar un mensaje de error al usuario aquí
      }
    });
    
    // Lógica para actualizar el perfil

    
    console.log('Perfil actualizado:', this.perfil);
  }

  cambiarContrasena() {
    // Lógica para cambiar la contraseña
    console.log('Cambiar contraseña');
  }

  irAMisQuejas() {
    this.router.navigate(['/mis-quejas']);
  }

  cerrarSesion() {
    // Lógica para cerrar sesión
    console.log('Cerrar sesión');
  }
}