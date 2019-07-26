import { Router } from 'express';

/* Multer é utilizado no upload de arquivos */
import multer from 'multer';
import multerConfig from './config/multer';

import User from './app/models/User';
import UserController from './app/controllers/UserController';

/* Realiza autenticação do cliente da api  */
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';

const routes = new Router();

const upload = multer(multerConfig);

routes.get('/', async (req, res) => {
  const users = await User.findAll();
  return res.json(users);
});
// Rota que cria um usuário novo
routes.post('/users', UserController.store);

// Rota que cria uma sessão nova do usuário / token
routes.post('/sessions', SessionController.store);

// Vericica acesso jwt
routes.use(authMiddleware);

// Rota que atualiza dados do usuário
routes.put('/users', UserController.update);

// Lista dados dos usuários que são providers
routes.get('/providers', ProviderController.index);

// Rota para fazer o agendamento
routes.post('/appointments', AppointmentController.store);

// Rota para listar os agendamentos
routes.get('/appointments', AppointmentController.index);

// Deleta um agendamento
routes.delete('/appointments/:id', AppointmentController.delete);

// Rota para listas os agendamentos do prestador de serviço
routes.get('/schedules', ScheduleController.index);

// Rota para listas as notificações do prestador de serviço
routes.get('/notifications', NotificationController.index);

// Rota para atualizar a notificação como lida
routes.put('/notifications/:id', NotificationController.update);

// Rota de upload de arquivo usando a middleware de um único arquivo
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
