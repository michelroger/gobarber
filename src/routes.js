import { Router } from 'express';

/* Multer é utilizado no upload de arquivos */
import multer from 'multer';
import multerConfig from './config/multer';

import User from './app/models/User';
import UserController from './app/controllers/UserController';

/* Realiza autenticação do cliente da api  */
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

const upload = multer(multerConfig);

routes.get('/', async (req, res) => {
  const users = await User.findAll();
  return res.json(users);
});

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Vericica acesso jwt
routes.use(authMiddleware);

routes.put('/users', UserController.update);

// Rota de upload de arquivo usando a middleware de um único arquivo
routes.post('/files', upload.single('file'), (req, res) => {
  return res.json({ ok: true });
});

export default routes;
