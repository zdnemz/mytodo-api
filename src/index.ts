import server from '@/libs/app/server';
import environment from '@app/environment';
import { logger } from '@utils/logger';
import { database } from '@app/database';

try {
  await database.connect();

  server.listen(environment.PORT, () => {
    logger.info(`Server running: successfully on port ${environment.PORT}`);
  });
} catch (err) {
  logger.error((err as Error).message);
  process.exit(1);
}
