export interface CuponDTO {
  id: string;
  codigo: string;
  nombre: string;
  porcentajeDescuento: number;
  estadoCupon: any; // Todo: Cambiar any por el tipo de dato correcto
  tipoCupon: any; // Todo: Cambiar any por el tipo de dato correcto
  fechaVencimiento: string; // Usamos string para representar la fecha en formato ISO
}
