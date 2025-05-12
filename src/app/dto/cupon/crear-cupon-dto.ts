export interface CrearCuponDTO {
  codigo: string;
  nombre: string;
  porcentajeDescuento: number;
  fechaVencimiento: string; // Usamos string para representar la fecha en formato ISO
}
