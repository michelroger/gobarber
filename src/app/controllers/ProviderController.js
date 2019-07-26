import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      where: {
        provider: true,
      },
      attributes: ['id', 'nome', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['nome', 'path', 'url'],
        },
      ],
    });

    return res.json(providers);
  }
}
export default new ProviderController();
