export interface CrearCuponDTO {
  codigo: string;
  nombre: string;
  porcentajeDescuento: number;
  tipoCupon: any; // Todo: Cambiar any por el tipo de dato correcto
  fechaVencimiento: string; // Usamos string para representar la fecha en formato ISO
}
