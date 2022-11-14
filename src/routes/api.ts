import { Router } from 'express';

import adminMw from './middlware/adminMw';
import validate from './middlware/validate';
import User from '@models/User';
import authRoutes from './auth-routes';
import userRoutes from './user-routes';
import listRoutes from './list-routes';
import categoryRoutes from './category-routes';
import placeRoutes from './place.routes';
import fileRoutes from './file-routes';

// **** Init **** //

const apiRouter = Router();

// **** Setup auth routes **** //

const authRouter = Router();

// Login user
authRouter.post(authRoutes.paths.login, validate('email', 'password'), authRoutes.login);

// Logout user
authRouter.get(authRoutes.paths.logout, authRoutes.logout);

// Add authRouter
apiRouter.use(authRoutes.paths.basePath, authRouter);

// **** Setup user routes **** //

const userRouter = Router();

// Get all users
userRouter.get(userRoutes.paths.get, userRoutes.getAll);

// Add one user
userRouter.post(userRoutes.paths.add, validate(['user', User.instanceOf]), userRoutes.add);

// Update one user
userRouter.put(userRoutes.paths.update, validate(['user', User.instanceOf]), userRoutes.update);

// Delete one user
userRouter.delete(userRoutes.paths.delete, validate(['id', 'number', 'params']), userRoutes.delete);

// Add userRouter
apiRouter.use(userRoutes.paths.basePath, adminMw, userRouter);

// **** Setup lists routes **** //

const listRouter = Router();

// Get most popular
listRouter.get(listRoutes.paths.getPopular, listRoutes.getMostPopular);

// Get most popular
listRouter.get(listRoutes.paths.getByQuery, listRoutes.getByQuery);

// Get by Id
listRouter.get(listRoutes.paths.get, listRoutes.getById);

// Add listRouter
apiRouter.use(listRoutes.paths.basePath, listRouter);

// **** Setup categories routes **** //

const categoryRouter = Router();

// Get all
categoryRouter.get(categoryRoutes.paths.get, categoryRoutes.getAll);

// Add categoryRouter
apiRouter.use(categoryRoutes.paths.basePath, categoryRouter);

// **** Setup places routes **** //

const placesRouter = Router();
placesRouter.get(placeRoutes.paths.getById, placeRoutes.getById);
placesRouter.post(placeRoutes.paths.create, placeRoutes.create);
placesRouter.put(placeRoutes.paths.update, placeRoutes.update);
placesRouter.delete(placeRoutes.paths.delete, placeRoutes.delete);

// Add placesRouter
apiRouter.use(placeRoutes.paths.basePath, placesRouter);

// **** Setup files routes **** //

const filesRouter = Router();
filesRouter.post(fileRoutes.paths.upload, fileRoutes.upload);
filesRouter.put(fileRoutes.paths.replace, fileRoutes.replace);

// Add filesRouter
apiRouter.use(fileRoutes.paths.basePath, filesRouter);

export default apiRouter;
