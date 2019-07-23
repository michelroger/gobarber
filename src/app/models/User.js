import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    // Antes de acontecer um save no banco este hook será chamado, sempre.
    this.addHook('beforeSave', async user => {
      if (user.password) {
        // o número 8 é o número de vezes que que o hash vai rodar para criar senha mais segura.
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  /*
  Comparação do password recebido pelo cliente com o hash gerado pelo bcrypt
  */
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
export default User;
