import { URL } from 'url';
import { getConsoleLogger } from '@libs/consoleLogger';
import morgan from 'morgan';
import { Request } from 'express';

const inboundLogger = getConsoleLogger('inboundLogging');
const parameterLogger = getConsoleLogger('parameterLogging');
inboundLogger.addContext('requestType', 'HttpLogging');
parameterLogger.addContext('requestType', 'HttpLogging');

const requestFormat = '[:method :url HTTP/:http-version] Started for :remote-addr';
const parameterFormat = ':params';
const responseFormat = 'Completed :status in :response-time[1] ms';

morgan.token('params', (req: Request, res) => {
  if (req.method === 'GET') {
    const params: { [k: string]: string } = {};
    new URL(
      req.protocol + '://' + req.get('host') + req.originalUrl,
    ).searchParams.forEach((v, k) => (params[k] = v));

    return JSON.stringify(params);
  }
  return JSON.stringify(req.body);
});

export const morganLogger = () => {
  return [
    morgan(requestFormat, {
      immediate: true,
      stream: {
        write: (str) => { inboundLogger.info(str.substring(0, str.lastIndexOf('\n'))); },
      },
    }),
    morgan(parameterFormat, {
      immediate: true,
      stream: {
        write: (str) => { parameterLogger.info(str.substring(0, str.lastIndexOf('\n'))); },
      },
    }),
    morgan(responseFormat, {
      stream: {
        write: (str) => { inboundLogger.info(str.substring(0, str.lastIndexOf('\n'))); },
      },
    }),
  ];
};
