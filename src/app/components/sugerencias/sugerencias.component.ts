import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sugerencias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sugerencias.component.html',
  styleUrl: './sugerencias.component.css'
})
export class SugerenciasComponent {
  sugerenciasForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.sugerenciasForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sugerencia: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.sugerenciasForm.valid) {
      console.log('Formulario enviado:', this.sugerenciasForm.value);
      alert('Sugerencia enviada con éxito');
      this.sugerenciasForm.reset();
    }
  }
}