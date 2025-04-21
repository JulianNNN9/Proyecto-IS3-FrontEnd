import { RespuestaQuejaDTO } from "./respuesta-queja-dto";

export interface QuejaDTO {
  id: string;
  clienteId: string;
  nombreCliente: string;
  descripcion: string;
  fecha: Date;
  estadoQueja: string;
  respuestaQueja: RespuestaQuejaDTO | null; // Puede ser null si no hay respuesta
  nombreServicio: string;
  nombreEstilista: string;
}