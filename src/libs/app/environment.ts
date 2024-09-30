import { config } from 'dotenv';

function environment() {
  config();

  return {
    // app
    NODE_ENV: process.env.NODE_ENV as string,
    CORS_ORIGIN: process.env.CORS_ORIGIN as string,
    PORT: Number(process.env.PORT),
    JWT_SECRET: process.env.JWT_SECRET as string,
    SESSION_SECRET: process.env.SESSION_SECRET as string,

    // mongodb
    MONGO_URI: process.env.MONGO_URI as string,
    MONGO_DB: process.env.MONGO_DB as string,
  };
}

export default environment();
