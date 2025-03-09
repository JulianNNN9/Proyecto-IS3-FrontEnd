import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  preguntas = [
    {
      pregunta: "¿Cómo puedo agendar una cita?",
      respuesta: "Puedes agendar una cita en línea a través de nuestro sitio web o llamando a nuestro número de atención."
    },
    {
      pregunta: "¿Cuáles son los métodos de pago aceptados?",
      respuesta: "Aceptamos pagos en efectivo, tarjetas de crédito/débito y transferencias bancarias."
    },
    {
      pregunta: "¿Qué productos utilizan para el cuidado del cabello y barba?",
      respuesta: "Utilizamos productos de alta calidad y marcas reconocidas para garantizar el mejor cuidado para nuestros clientes."
    }
  ];
}
