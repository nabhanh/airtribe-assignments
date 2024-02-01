declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: 'prod' | 'dev' | 'test';
      PORT?: string;
      JWT_SECRET?: string;
      JWT_EXPIRES_IN?: string;
      SMTP_USER?: string;
      SMTP_PASS?: string;
      API_KEY?: string;
      SALT_ROUNDS?: string;
    }
  }
  namespace Express {
    export interface Request {}
  }
}

export {};
