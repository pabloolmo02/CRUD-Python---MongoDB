
import { component$, useStore, useTask$, useVisibleTask$, $, useSignal } from '@builder.io/qwik';
// Importaciones ajustadas para el contexto de canciones
import { Cancion } from '~/models/cancion';
import { addCancion, deleteCancionByTitulo, getCanciones, updateCancion } from '~/utils/canciones-provider';

export const CancionesList = component$(() => {
    const store = useStore<{ canciones: Cancion[]}>({
        canciones: [] // Ajuste a 'canciones'
    });

    // Ajustar el formulario para reflejar los atributos de una canción
    const form = useStore({
        titulo: '',
        artista: '',
        album: '',
        fecha_lanzamiento: '',

    });

    const addOrModify = useSignal("Añadir");
    const oldTitulo = useSignal(""); // Cambiado de oldDni a oldTitulo

    // Carga inicial de canciones
    useVisibleTask$(async () => {
        store.canciones = await getCanciones(); // Ajustado a getCanciones
    });

    // Manejo de la lógica de submit para agregar o modificar canciones
    const handleSubmit = $(async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (addOrModify.value === 'Añadir') {
            await addCancion(form); 
        } else {
            await updateCancion(oldTitulo.value, form); 
            addOrModify.value = "Añadir";
        }
    });

    // Ajuste del manejo de input para reflejar los campos de una canción
    const handleInputChange = $((event: any) => {
        const target = event.target as HTMLInputElement;
        form[target.name] = target.value;
    });

    // Lógica para copiar los datos de una canción al formulario para su modificación
    const copyForm = $((cancion: Cancion) => {
        
        form.titulo = cancion.titulo;
        form.artista = cancion.artista;
        form.album = cancion.album;
        form.fecha_lanzamiento = cancion.fecha_lanzamiento; 
    });

    // Limpieza del formulario
    const CleanForm = $(() => {
        form.titulo = "";
        form.artista = "";
        form.album = "";
        form.fecha_lanzamiento = "";
    });

    // Eliminación de una canción por título
    const deleteCancion = $(async (titulo: string) => {
        await deleteCancionByTitulo(titulo); 
        store.canciones = await getCanciones(); 
    });

   
    

   
    return (
        <div class="flex justify-center">
            <div>
                <div class="bg-djset-100 px-6 py-4 rounded-2xl">
                    <table class="border-separate border-spacing-2">
                        <thead>
                            <tr>
                                <th class="title">Título</th>
                                <th class="title">Artista</th>
                                <th class="title">Álbum</th>
                                <th class="title">Fecha de Lanzamiento</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.canciones.map((cancion) => (
                                <tr key={cancion.titulo}>
                                    <td>{cancion.titulo}</td>
                                    <td>{cancion.artista}</td>
                                    <td>{cancion.album}</td>
                                    <td>{cancion.fecha_lanzamiento}</td>
                                    <td>
                                        <button 
                                            class="bg-red-600"
                                            onClick$={() => deleteCancion(cancion.titulo)}>
                                            <i class="fa-solid fa-trash"></i>
                                            Borrar
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                            class="bg-orange-300"
                                            onClick$={() => {
                                                addOrModify.value = 'Modificar';
                                                oldTitulo.value = cancion.titulo;
                                                copyForm(cancion);
                                            }}>
                                            <i class="fa-regular fa-pen-to-square"></i>
                                            Modificar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <form onSubmit$={handleSubmit}>
                                    <td>
                                        <input 
                                            name='titulo' 
                                            type="text" 
                                            value={form.titulo} 
                                            onInput$={handleInputChange}/>
                                    </td>
                                    <td>
                                        <input 
                                            name='artista' 
                                            type="text" 
                                            value={form.artista} 
                                            onInput$={handleInputChange}/>
                                    </td>
                                    <td>
                                        <input 
                                            name='album' 
                                            type="text" 
                                            value={form.album} 
                                            onInput$={handleInputChange}/>
                                    </td>
                                    <td>
                                        <input 
                                            name='fecha_lanzamiento' 
                                            type="text" 
                                            value={form.fecha_lanzamiento} 
                                            onInput$={handleInputChange}/>
                                    </td>
                                    <td>
                                        <button 
                                            class="bg-green-500"
                                            type='submit'>
                                                <i class="fa-regular fa-circle-check"></i>
                                                Aceptar
                                        </button>
                                    </td>
                                    <td>
                                        <span 
                                            class="button bg-red-600"
                                            style={`visibility: ${addOrModify.value === 'Añadir' ? 'hidden' : 'visible'}`}
                                            onClick$={() => {addOrModify.value = "Añadir"; CleanForm();}}>
                                                <i class="fa-regular fa-rectangle-xmark"></i>
                                                Cancelar
                                        </span>
                                    </td>
                                </form>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
            </div>
        </div>
    );
                                        });    
