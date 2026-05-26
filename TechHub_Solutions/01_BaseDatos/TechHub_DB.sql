-- 1. CREACIÓN Y ACTUALIZACIÓN DE TABLAS BASE

CREATE TABLE IF NOT EXISTS "Usuarios" (
    "Id" SERIAL PRIMARY KEY,
    "Nombre" TEXT NOT NULL,
    "Correo" TEXT UNIQUE NOT NULL,    -- Cambiado de 'Email' según tu modelo frontend
    "Contrasena" TEXT NOT NULL,       -- Cambiado de 'Password' según tu modelo frontend
    "Direccion" TEXT,                 -- Nuevo campo detectado en el modelo
    "Rol" TEXT NOT NULL DEFAULT 'Pasajero', -- Roles detectados: 'Pasajero' | 'Piloto'
    "Licencia" TEXT
);

CREATE TABLE IF NOT EXISTS "Aeropuertos" (
    "Id" SERIAL PRIMARY KEY,
    "Nombre" TEXT NOT NULL,
    "Ciudad" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "Vuelos" (
    "Id" SERIAL PRIMARY KEY,
    "Codigo" TEXT NOT NULL,
    "AeropuertoOrigenId" INTEGER REFERENCES "Aeropuertos"("Id"),
    "AeropuertoDestinoId" INTEGER REFERENCES "Aeropuertos"("Id"),
    "FechaSalida" TIMESTAMP WITH TIME ZONE NOT NULL,
    "CuposDisponibles" INTEGER DEFAULT 0,
    "CuposMaximos" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "Pilotos" (
    "Id" SERIAL PRIMARY KEY,
    "UsuarioId" INTEGER REFERENCES "Usuarios"("Id"),
    "Nombre" TEXT NOT NULL,     -- Agregado según el modelo Piloto del frontend
    "Licencia" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "Reservas" (
    "Id" SERIAL PRIMARY KEY,
    "UsuarioId" INTEGER REFERENCES "Usuarios"("Id"),
    "VueloId" INTEGER REFERENCES "Vuelos"("Id")
);


-- 2. NUEVAS TABLAS DETECTADAS EN LOS MODELOS Y SERVICIOS

-- Basado en src/app/models/horas-vuelo.ts y HorasVueloController.cs
CREATE TABLE IF NOT EXISTS "HorasVuelo" (
    "Id" SERIAL PRIMARY KEY,
    "UsuarioId" INTEGER REFERENCES "Usuarios"("Id") ON DELETE CASCADE,
    "Fecha" TIMESTAMP WITH TIME ZONE NOT NULL,
    "Horas" NUMERIC(5,2) NOT NULL,
    "TipoVuelo" TEXT NOT NULL, -- Detectado: 'Local' | 'Nacional' | 'Internacional'
    "Origen" TEXT,
    "Destino" TEXT,
    "Notas" TEXT
);

-- Basado en src/app/models/practica.ts y PracticasController.cs
CREATE TABLE IF NOT EXISTS "Practicas" (
    "Id" SERIAL PRIMARY KEY,
    "UsuarioId" INTEGER REFERENCES "Usuarios"("Id") ON DELETE CASCADE,
    "Fecha" TIMESTAMP WITH TIME ZONE NOT NULL,
    "Tipo" TEXT NOT NULL, -- Detectado: 'Teorica' | 'Practica'
    "Horas" NUMERIC(5,2) NOT NULL,
    "Descripcion" TEXT,
    "Instructor" TEXT,
    "Completada" BOOLEAN DEFAULT FALSE
);

-- Basado en AvionesController.cs, MantenimientosController.cs y ActualizarCapacidadAvionDTO.cs
CREATE TABLE IF NOT EXISTS "Aviones" (
    "Id" SERIAL PRIMARY KEY,
    "Capacidad" INTEGER NOT NULL
    -- (Nota: Puedes agregar "Matricula" o "Modelo" si lo necesitas luego)
);

CREATE TABLE IF NOT EXISTS "Mantenimientos" (
    "Id" SERIAL PRIMARY KEY,
    "AvionId" INTEGER REFERENCES "Aviones"("Id") ON DELETE CASCADE,
    "DatosMantenimiento" TEXT, -- Según crearMantenimiento(datosMantenimiento)
    "FechaRegistro" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Basado en ClasesController.cs y ClaseDTO.cs
CREATE TABLE IF NOT EXISTS "Clases" (
    "Id" SERIAL PRIMARY KEY,
    "Nombre" TEXT NOT NULL,
    "Descripcion" TEXT
);