export type CreateUserParams = {
    Nombre: string;
    Correo: string;
    Tipo: 'SUPERVISOR' | 'COORDINADOR' | 'DIRECTOR';
    Contraseña: string;
}