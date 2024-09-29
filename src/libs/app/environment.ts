import { config } from 'dotenv';
config();

export default {
  // app
  NODE_ENV: process.env.NODE_ENV as string,
  PORT: Number(process.env.PORT),
  JWT_SECRET: process.env.JWT_SECRET as string,
  SESSION_SECRET: process.env.SESSION_SECRET as string,
};
