import type { Document } from 'mongoose';

export interface User extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  birthdate: Date;
  gender: 'male' | 'female' | 'unknown';
}
