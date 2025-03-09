import { EstadoQueja } from '../dto/queja/estado-queja';

export interface Queja {
  id: string;
  clienteId: string;
  descripcion: string;
  fecha: Date;
  estadoQueja: EstadoQueja;
  servicioId: string;
}