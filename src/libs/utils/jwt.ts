import jsonwebtoken from 'jsonwebtoken';
import environment from '@app/environment';

const jwt = {
  sign: (payload: string | Buffer | object) => {
    try {
      return jsonwebtoken.sign(payload, environment.JWT_SECRET, {
        expiresIn: '7d',
      });
    } catch (err) {
      throw new Error(`JWT Error: ${(err as Error).message}`);
    }
  },
  verify: (token: string) => {
    try {
      return jsonwebtoken.verify(token, environment.JWT_SECRET);
    } catch (err) {
      throw new Error(`JWT Error: ${(err as Error).message}`);
    }
  },
};

export default jwt;
