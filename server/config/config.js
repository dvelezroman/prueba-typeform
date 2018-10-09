// =========================
// PORT
// =========================
process.env.PORT = process.env.PORT || 3001;

// =========================
// Environment
// =========================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// =========================
// TOKEN EXPIRE TIME
// =========================
process.env.TOKEN_TIME = 60 * 60 * 24 * 30;

// =========================
// TOKEN SEED
// =========================
process.env.TOKEN_SEED = process.env.TOKEN_SEED || "develop";

// =========================
// URI CONECTIONS
// =========================
let uriDB =
  process.env.NODE_ENV === "dev"
    ? "postgres://postgres:password@db:5432/typeform"
    : process.env.DATABASE_URL; // heroku environment variable

process.env.URI_DB = uriDB;

//
