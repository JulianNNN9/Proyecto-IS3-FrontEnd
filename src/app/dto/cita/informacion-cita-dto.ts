import { EstadoCita } from './estados-cita.enum';

/**
 * DTO con la información completa de una cita
 */
export interface InformacionCitaDTO {
  usuarioId: string;
  estilistaId: string;
  servicioId: string;
  fechaHora: Date;
  estado: EstadoCita;
}