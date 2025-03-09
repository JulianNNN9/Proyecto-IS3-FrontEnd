export interface QuejaSugerenciaDTO {

    id: string;
    tipo: string;
    cliente: string;
    descripcion: string;
    estado: string;
    respuesta: string;
    fechaEnvio: string; // Fecha en formato ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
    fechaRespuesta: string; 

}
