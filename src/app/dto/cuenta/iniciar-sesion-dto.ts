import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export interface IniciarSesionDTO {
    email: string;
    contrasenia: string;
}