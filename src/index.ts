import server from '@/libs/app/server';
import environment from '@app/environment';

server.listen(environment.PORT, () => {
  console.log(`server running on port ${environment.PORT}`);
});
