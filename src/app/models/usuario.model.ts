
export interface Usuario {
    id?: number;          // El ID puede ser opcional en caso de que no esté presente al crear un nuevo usuario
    nombre: string;
    password: string;     
    rol: string;          // Ejemplo: 'user', 'admin', etc.
  }
  
  export interface UsuarioDTO {
    id: number;
    nombre: string;
    password: string
    rol: string;          // Solo campos necesarios para la vista
  }