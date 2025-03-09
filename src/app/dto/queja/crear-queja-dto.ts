import { EstadoQueja } from './estado-queja';

export interface CrearQuejaDTO {
  clienteId: string;
  descripcion: string;
  fecha: Date;
  servicioId: string;
}