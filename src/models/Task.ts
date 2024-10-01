import type { Task } from '@/types/models';
import { model, Schema } from 'mongoose';

const userSchema = new Schema<Task>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    description: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'in_progress', 'completed'],
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model('Task', userSchema);
