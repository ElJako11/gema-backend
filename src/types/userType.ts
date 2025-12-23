export type CreateUserParams = {
    nombre: string;
    correo: string;
    tipo: 'SUPERVISOR' | 'COORDINADOR' | 'DIRECTOR';
    contraseña: string;
}