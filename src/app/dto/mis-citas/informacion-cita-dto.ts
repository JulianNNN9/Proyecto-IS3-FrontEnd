export interface InformacionCitaDTO {
  citaId: string; // Identificador único de la cita
  usuarioId: string; // Identificador del usuario
  estilistaId: string; // Identificador del estilista
  servicioId: string; // Identificador del servicio
  fechaHora: string; // Fecha y hora de la cita (en formato ISO 8601)
  estado: string; // Estado de la cita (ej. "Pendiente", "Cancelada", etc.)
}