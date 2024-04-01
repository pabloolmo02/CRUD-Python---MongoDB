
import { Cancion } from "~/models/cancion"

// Obtiene todas las canciones
export const getCanciones = async (): Promise<Cancion[]> => {
    try {
        const response = await fetch('http://localhost:8000/canciones/')
        const canciones = await response.json()
        return canciones
    } catch (error) {
        console.error(error)
    }

    return [] as Cancion[]
}

// Añade una canción.

export const addCancion = async (cancion: Cancion) => {
    try {
        await fetch('http://localhost:8000/canciones/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cancion),
        })
        
    } catch (error) {
        console.error(error)
    }
}

// Modifica una canción.
export const updateCancion = async (titulo: string, cancion: Cancion) => {
    try {
        await fetch(`http://localhost:8000/canciones/${encodeURIComponent(titulo)}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cancion),
        })
        
    } catch (error) {
        console.error(error)
    }
}

// Elimina una canción.
export const deleteCancionByTitulo = async (titulo: string) => {
    try {
        await fetch(`http://localhost:8000/canciones/${encodeURIComponent(titulo)}`,
        {
            method: 'DELETE',
        })
        
    } catch (error) {
        console.error(error)
    }
}
