import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.css'
})
export class CitasComponent {
  beneficios = [
    {
      titulo: 'Atención Personalizada',
      descripcion: 'Cada cliente recibe un servicio único adaptado a sus necesidades y preferencias.',
      icono: 'bi bi-person-heart'
    },
    {
      titulo: 'Ambiente Acogedor',
      descripcion: 'Disfruta de un espacio diseñado para tu comodidad y relajación.',
      icono: 'bi bi-house-heart'
    },
    {
      titulo: 'Profesionales Expertos',
      descripcion: 'Nuestro equipo está altamente capacitado y actualizado en las últimas tendencias.',
      icono: 'bi bi-award'
    }
  ];

  horarios = {
    lunes: '8:00 AM - 7:00 PM',
    martes: '8:00 AM - 7:00 PM',
    miercoles: '8:00 AM - 7:00 PM',
    jueves: '8:00 AM - 7:00 PM',
    viernes: '8:00 AM - 7:00 PM',
    sabado: '9:00 AM - 6:00 PM',
    domingo: 'Cerrado'
  };
}