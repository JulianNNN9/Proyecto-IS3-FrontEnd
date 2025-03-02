import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export interface CrearUsuarioDTO {
    cedula: string;
    nombreCompleto: string;
    direccion?: string;
    telefono?: string;
    email: string;
    contrasenia: string;
}