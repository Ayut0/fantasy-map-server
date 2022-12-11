import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';

import 'express-async-errors';

import BaseRouter from './routes/api';
import logger from 'jet-logger';
import EnvVars from '@configurations/EnvVars';
import HttpStatusCodes from '@configurations/HttpStatusCodes';
import { NodeEnvs } from '@declarations/enums';
import { RouteError } from '@declarations/classes';

// **** Init express **** //

const app = express();

// **** Set basic express settings **** //
console.log('force redeploy... again');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.cookieProps.secret));

// Show routes called in console during development
if (EnvVars.nodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.nodeEnv === NodeEnvs.Production) {
  app.use(helmet());
}

// **** Add API routes **** //

// Add APIs
app.use('/api', BaseRouter);

// Setup error handler
app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    logger.err(err, true);
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  }
);

// **** Serve front-end content **** //

// Set views directory (html)
// const viewsDir = path.join(__dirname, 'views');
// app.set('views', viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

app.get('*', (_req, res) =>{
  res.sendFile(path.join(staticDir, 'index.html'));
});

// Add Content Security Policy header
app.use((_req, res, next) => {
  const imgPolicy = "img-src 'self' https://fwopkmydqtaqjnappurl.supabase.co";
  const scriptPolicy = "script-src 'self' https://maps.googleapis.com";
  const defaultPolicy = "default-src 'self'";
  res.setHeader('Content-Security-Policy', [imgPolicy, scriptPolicy, defaultPolicy].join('; '));
  next();
});

// **** Export default **** //

export default app;
