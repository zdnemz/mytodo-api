import type { Document, Schema } from 'mongoose';

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
  userId: Schema.Types.ObjectId;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: Date | null;
}
