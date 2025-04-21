export interface ReprogramarCitaDTO {
  citaId: string;       // Identificador único de la cita
  nuevaFechaHora: string; // Nueva fecha y hora en formato esperado por el backend
}