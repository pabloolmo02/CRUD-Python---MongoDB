from fastapi import FastAPI, HTTPException

# Para poder utilizar campos con fecha
from datetime import date, datetime

# Pydantic es una librería para validar los datos.
# BaseModel sirve para definir clases para crear los modelos de datos que se van a usar en la API.
from pydantic import BaseModel

from typing import List

# Motor es una versión asíncrona de PyMongo,
# la biblioteca estándar de Python para trabajar con MongoDB.
import motor.motor_asyncio

# Para aceptar peticiones de diferentes dominios.
from fastapi.middleware.cors import CORSMiddleware


# Define el modelo de datos para un usuario utilizando Pydantic.
# Esto ayuda a FastAPI a validar los tipos de datos entrantes.


class Cancion(BaseModel):
    titulo: str
    artista: str
    album: str
    fecha_lanzamiento: str
  

# Crea la instancia de la aplicación FastAPI
app = FastAPI()

# Lista de origenes permitidos.
origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Método permitidos
    allow_headers=["*"], # Cabeceras permitidas
)

# Cadena de conexión a MongoDB con autenticación
MONGODB_URL = "mongodb://admin:123@mongodb:27017/?authSource=admin"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client.cancionesdb

# Endpoint para listar todas las canciones.


@app.get("/canciones/", response_description="Lista todas las canciones", response_model=List[Cancion])
async def list_canciones():
    canciones = await db["canciones"].find().to_list(1000)
    return canciones


#Endpoint para crear una nueva canción

@app.post("/canciones/", response_description="Añade una nueva canción", response_model=Cancion)
async def create_cancion(cancion: Cancion):
    cancion_dict = cancion.dict()
    await db["canciones"].insert_one(cancion_dict)
    return cancion


# Endpoint praa obtener una canción especifica por el titulo.

@app.get("/canciones/{titulo}", response_description="Obtiene una canción", response_model=Cancion)
async def find_cancion(titulo: str):
    cancion = await db["canciones"].find_one({"titulo": titulo})
    if cancion is not None:
        return cancion
    raise HTTPException(status_code=404, detail=f"Canción con título '{titulo}' no se ha encontrado.")


# Endpoint para borrar una canción especifica por el titulo.

@app.delete("/canciones/{titulo}", response_description="Borra una canción", status_code=204)
async def delete_cancion(titulo: str):
    delete_result = await db["canciones"].delete_one({"titulo": titulo})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Canción con título '{titulo}' no se ha encontrado.")


# Endpoint para actualizar una canción especifica por el titulo.

@app.put("/canciones/{titulo}", response_description="Actualiza una canción", status_code=204)
async def update_cancion(titulo: str, cancion: Cancion):
    await db["canciones"].update_one({"titulo": titulo}, {"$set": cancion.dict()})
    return cancion

