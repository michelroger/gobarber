import { Router } from 'express';
import User from './app/models/User';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/', async (req, res) => {
  const users = await User.findAll();
  return res.json(users);
});

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Vericica acesso jwt
routes.use(authMiddleware);

routes.put('/users', UserController.update);

export default routes;
