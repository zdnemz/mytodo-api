import mongoose from 'mongoose';
import environment from './environment';
import { logger } from '../utils/logger';

class Database {
  private static instance: Database;

  private constructor() {}

  public static async getInstance(): Promise<Database> {
    if (!Database.instance) {
      const db = new Database();
      await db.connect();
      Database.instance = db;
    }
    return Database.instance;
  }

  private async connect() {
    try {
      await mongoose.connect(environment.MONGO_URI, {
        dbName: environment.MONGO_DB,
      });
      logger.info('Database connection: successfully');
    } catch (error) {
      logger.error(`Database connection error: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  public async disconnect() {
    try {
      await mongoose.disconnect();
      logger.info('Database disconnected: successfully');
    } catch (error) {
      logger.error(`Database disconnection error: ${(error as Error).message}`);
      process.exit(1);
    }
  }
}

export const database = await Database.getInstance();
