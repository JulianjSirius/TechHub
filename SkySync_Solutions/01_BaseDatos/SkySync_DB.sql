-- 1. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS "Usuarios" (
    "Id" SERIAL PRIMARY KEY,
    "Nombre" TEXT NOT NULL,
    "Email" TEXT UNIQUE NOT NULL,
    "Password" TEXT NOT NULL,
    "Licencia" TEXT -- Asegurada para el error que tenías
);

-- 2. Tabla de Aeropuertos (Actualizada con la columna Estado)
CREATE TABLE IF NOT EXISTS "Aeropuertos" (
    "Id" SERIAL PRIMARY KEY,
    "Nombre" TEXT NOT NULL,
    "Ciudad" TEXT NOT NULL,
    "Estado" TEXT DEFAULT 'Disponible' -- Agregado para manejar Disponibilidad/Mantenimiento/Sin uso
);

-- 3. Tabla de Vuelos
CREATE TABLE IF NOT EXISTS "Vuelos" (
    "Id" SERIAL PRIMARY KEY,
    "Codigo" TEXT NOT NULL,
    "AeropuertoOrigenId" INTEGER REFERENCES "Aeropuertos"("Id"),
    "AeropuertoDestinoId" INTEGER REFERENCES "Aeropuertos"("Id"),
    "FechaSalida" TIMESTAMP WITH TIME ZONE NOT NULL,
    "CuposDisponibles" INTEGER DEFAULT 0,
    "CuposMaximos" INTEGER DEFAULT 0
);

-- 4. Tabla de Pilotos
CREATE TABLE IF NOT EXISTS "Pilotos" (
    "Id" SERIAL PRIMARY KEY,
    "UsuarioId" INTEGER REFERENCES "Usuarios"("Id"),
    "Licencia" TEXT
);

-- 5. Tabla de Reservas (Actualizada con todas las propiedades faltantes)
CREATE TABLE IF NOT EXISTS "Reservas" (
    "Id" SERIAL PRIMARY KEY,
    "UsuarioId" INTEGER REFERENCES "Usuarios"("Id"),
    "VueloId" INTEGER REFERENCES "Vuelos"("Id"),
    "Estado" TEXT, -- Agregado para manejar el flujo "En proceso" / "Completado"
    "ClaseId" INTEGER, -- Agregado para corregir el error 42703 (Falta la columna ClaseId)
    "FechaReserva" TIMESTAMP WITH TIME ZONE -- Agregado para corregir el error 42703 (Falta la columna FechaReserva)
);