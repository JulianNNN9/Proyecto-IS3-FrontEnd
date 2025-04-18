import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/**
 * Componente para mostrar las preguntas frecuentes (FAQ)
 * Presenta una lista de preguntas y respuestas comunes para los usuarios
 */
@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  /**
   * Array que contiene las preguntas frecuentes y sus respectivas respuestas
   * Cada elemento tiene una propiedad 'pregunta' y una 'respuesta'
   */
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

  // Nota: Este componente es principalmente declarativo, mostrando información estática.
  // Si se necesitara cargar las preguntas desde una API, se podrían implementar
  // métodos adicionales para obtener los datos dinámicamente.
}