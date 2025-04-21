/**
 * DTO para reprogramar una cita existente
 */
export interface ReprogramarCitaDTO {
  citaId: string;
  nuevaFechaHora: string;
}