export interface CrearCitaDTO {
  idEstilista: string; // Identificador del estilista
  idServicio: string;  // Identificador del servicio
  idCliente: string;   // Identificador del cliente
  fechaHora: string;   // Fecha y hora de la cita en formato ISO 8601
}