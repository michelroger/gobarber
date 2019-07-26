import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    // Esquema que representa a validação dos dados recebido pelo usuário
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(4),
    });
    // Teste do schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const userExists = await User.findOne({
      where: { email: req.body.email },
    });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, nome, email, provider, avatar_id } = await User.create(
      req.body
    );
    return res.json({
      id,
      nome,
      email,
      provider,
      avatar_id,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(4),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, nome, provider, avatar_id } = await user.update(req.body);

    return res.json({ id, nome, email, provider, avatar_id });
  }
}

export default new UserController();
