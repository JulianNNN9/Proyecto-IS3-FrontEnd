import { Component } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { QuejaPorTipoDTO } from '../../dto/quejasugerencia/queja-por-tipo-dto';
import { QuejaPorClienteDTO } from '../../dto/quejasugerencia/queja-por-cliente-dto';
import { ReporteService } from '../../services/reporte.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reporte-graficos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reporte-graficos.component.html',
  styleUrl: './reporte-graficos.component.css'
})
export class ReporteGraficosComponent {
  private charts: { [key: string]: Chart } = {}; // Almacena los gráficos

  clienteId: string = ""; // ID del cliente ingresado
  quejasPorTipo: QuejaPorTipoDTO[] = [];
  quejasPorCliente: QuejaPorClienteDTO[] = [];
  quejasClienteEspecifico: QuejaPorTipoDTO[] = [];

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.obtenerQuejasPorTipo();
    this.obtenerQuejasPorCliente();
  }

  obtenerQuejasPorTipo(): void {
    this.reporteService.obtenerQuejasPorTipo().subscribe(response => {
      if (!response.error) {
        this.quejasPorTipo = response.respuesta;
        this.generarGrafico("chartQuejasPorTipo", "bar", this.quejasPorTipo, "Cantidad de Quejas por Tipo");
      }
    });
  }

  obtenerQuejasPorCliente(): void {
    this.reporteService.obtenerQuejasPorCliente().subscribe(response => {
      if (!response.error) {
        this.quejasPorCliente = response.respuesta;
        this.generarGrafico("chartQuejasPorCliente", "pie", this.quejasPorCliente, "Quejas por Cliente");
      }
    });
  }

  obtenerQuejasPorClienteEspecifico(): void {
    if (!this.clienteId || !this.clienteId.trim()) return;

    this.reporteService.obtenerQuejasPorTipoDeCliente(this.clienteId).subscribe(response => {
      if (!response.error) {
        this.quejasClienteEspecifico = response.respuesta;
        this.generarGrafico("chartQuejasPorClienteEspecifico", "doughnut", this.quejasClienteEspecifico, `Quejas de Cliente ID: ${this.clienteId}`);
      }
    });
  }

  generarGrafico(
    canvasId: string,
    tipo: ChartType, 
    data: (QuejaPorTipoDTO | QuejaPorClienteDTO)[], 
    titulo: string
  ): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.error(`No se encontró el canvas con ID: ${canvasId}`);
      return;
    }
  
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error(`No se pudo obtener el contexto del canvas: ${canvasId}`);
      return;
    }

    // 🔹 Limpia el canvas antes de crear un nuevo gráfico
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🔹 Si ya existe un gráfico, lo destruimos antes de crear otro
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }
  
    // 🔹 Extraemos las etiquetas y valores
    const labels = data.map(item => ('tipo' in item ? item.tipo : item.cliente));
    const values = data.map(item => item.cantidad);
  
    // 🔹 Creamos el gráfico y lo guardamos en el objeto charts
    this.charts[canvasId] = new Chart(ctx, {
      type: tipo,
      data: {
        labels: labels,
        datasets: [{
          label: titulo,
          data: values,
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
