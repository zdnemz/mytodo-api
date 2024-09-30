import server from '@/libs/app/server';
import environment from '@app/environment';
import { logger } from '@utils/logger';
import { database } from '@app/database';

await database;

server.listen(environment.PORT, () => {
  logger.info(`server running on port ${environment.PORT}`);
});
