CREATE TABLE IF NOT EXISTS usuarios (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    lastname        VARCHAR(100) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    phone           VARCHAR(20),
    password        VARCHAR(255) NOT NULL,
    provincia       VARCHAR(100),
    direccion       TEXT,
    codigo_postal   VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS productos (
    id          SERIAL PRIMARY KEY,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    name        VARCHAR(255) NOT NULL,
    price       INTEGER NOT NULL,
    category    VARCHAR(50) NOT NULL,
    image       VARCHAR(100) NOT NULL,
    description TEXT,
    stock       INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS carrito (
    usuario_id  INTEGER NOT NULL REFERENCES usuarios(id),
    producto_id INTEGER NOT NULL REFERENCES productos(id),
    quantity    INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (usuario_id, producto_id)
);

CREATE TABLE IF NOT EXISTS ordenes (
    id              SERIAL PRIMARY KEY,
    usuario_id      INTEGER NOT NULL REFERENCES usuarios(id),
    subtotal        INTEGER NOT NULL,
    shipping        INTEGER NOT NULL DEFAULT 2500,
    total           INTEGER NOT NULL,
    currency        VARCHAR(20) DEFAULT 'colones',
    transaction_id  VARCHAR(100),
    estado          VARCHAR(50) DEFAULT 'completado',
    provincia       VARCHAR(100),
    direccion       TEXT,
    codigo_postal   VARCHAR(10),
    phone           VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS detalle_ordenes (
    orden_id        INTEGER NOT NULL REFERENCES ordenes(id) ON DELETE CASCADE,
    producto_id     INTEGER NOT NULL REFERENCES productos(id),
    product_name    VARCHAR(255) NOT NULL,
    unit_price      INTEGER NOT NULL,
    quantity        INTEGER NOT NULL,
    subtotal        INTEGER NOT NULL,
    PRIMARY KEY (orden_id, producto_id)
);
