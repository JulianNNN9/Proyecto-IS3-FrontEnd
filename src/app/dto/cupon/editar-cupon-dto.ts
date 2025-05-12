import { EstadoCupon } from '../../enums/EstadoCupon'; // Update the path as needed

export interface EditarCuponDTO {
  id: string;
  codigo: string;
  nombre: string;
  porcentajeDescuento: number;
  estadoCupon: EstadoCupon; 
  fechaVencimiento: string; // Usamos string para representar la fecha en formato ISO
}
