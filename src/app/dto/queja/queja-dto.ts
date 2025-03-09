import { EstadoQueja } from './estado-queja';

export interface QuejaDTO {
  id: string;
  clienteId: string;
  descripcion: string;
  fecha: Date;
  estadoQueja: EstadoQueja;
  servicioId: string;
}