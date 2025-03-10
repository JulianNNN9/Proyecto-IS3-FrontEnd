export interface QuejaDTO {
  id: string;
  clienteId: string;
  nombreCliente: string;
  descripcion: string;
  fecha: Date;
  estadoQueja: string;
  servicioId: string;
}