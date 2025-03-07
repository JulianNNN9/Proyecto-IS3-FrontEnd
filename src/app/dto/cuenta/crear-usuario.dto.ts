export interface CrearUsuarioDTO {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  direccion?: string; // Campo opcional
  telefono?: string; // Campo opcional
}
