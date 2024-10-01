import type { Document } from 'mongoose';

export interface User extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  birthdate: Date;
  gender: 'male' | 'female' | 'unknown';
  createdAt: Date;
  updatedAt: Date;
}

export interface Task extends Document {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: Date | null;
}
