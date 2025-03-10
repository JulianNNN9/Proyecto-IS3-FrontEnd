import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { QuejaDTO } from '../../dto/queja/queja-dto';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-gestionar-quejas',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './gestionar-quejas.component.html',
  styleUrl: './gestionar-quejas.component.css'
})
export class GestionarQuejasComponent {
  quejas: QuejaDTO[] = []; // Lista de quejas

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.cargarQuejas();
  }

  cargarQuejas(): void {
    this.adminService.listarQuejas().subscribe({
      next: (data) => {
        this.quejas = data.respuesta; // Asegurar que se accede a la propiedad correcta
      },
      error: (error) => {
        console.error('Error al obtener quejas:', error);
      }
    });
  }
}
