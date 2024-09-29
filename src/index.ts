import server from '@/libs/app/server';
import environment from '@app/environment';
import { logger } from '@utils/logger';

server.listen(environment.PORT, () => {
  logger.info(`server running on port ${environment.PORT}`);
});
