import environment from '@/libs/app/environment';
import session from 'express-session';

export default session({
  secret: environment.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: environment.NODE_ENV === 'production',
  },
});
