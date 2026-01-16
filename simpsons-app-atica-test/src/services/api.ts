
export interface Character {
  id: number;
  name: string;
  normalized_name: string;
  gender: string;
  status: string;
  occupation: string;
  portrait_path: string; // Este es el campo que pide la prueba para la imagen
}

// estructura de la respuesta de la API
interface ApiResponse {
  count: number;      
  next: string | null;
  pages: number;      
  prev: string | null;
  results: Character[]; 
}

const BASE_URL = 'https://thesimpsonsapi.com/api';

export const getCharacters = async (page: number = 1, name: string = ''): Promise<ApiResponse | null> => {
  try {
    let url = `${BASE_URL}/characters?`;
    
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    params.append('page', page.toString());

    url += params.toString();

    console.log("Cargando URL:", url); // <--- Esto es para ver si la API anda enviando cosas bien. jeje

    const response = await fetch(url);
    if (!response.ok) throw new Error('Error en la petición');

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching characters:", error);
    return null;
  }
};