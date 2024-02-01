import pino, { transport } from 'pino';
import { pinoHttp } from 'pino-http';

const fileTransport = transport({
  target: 'pino/file',
  options: { destination: `${__dirname}/../app.log` }
});

export default pinoHttp(
  {
    customAttributeKeys: {
      req: 'request',
      res: 'response',
      err: 'error',
      responseTime: 'timeTaken'
    },
    customLogLevel: (res, err) => {
      if ((res.statusCode || 500) >= 400 && (res.statusCode || 500) < 500) {
        return 'warn';
      } else if ((res.statusCode || 500) >= 500 || err) {
        return 'error';
      }
      return 'info';
    }
  },
  fileTransport
);

export const logger = pino(fileTransport);
