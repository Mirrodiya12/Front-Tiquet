export interface Categoria {
    idCategoria?: string;
    nombre: string;
    precio: number;
    stock: number;
    fechaExpira: string;
    idEvento?: string;
    evento: {
        idEvento: string;
    } | null;
} 