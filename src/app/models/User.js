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

  // Cria o relacionamento da tabela Files com a tabela Users
  static associate(models) {
    // pertence A models de file
    // Salva o id da tabela files na tabela users referenciando avatar_id como chave estrangeira da tebela files
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  /*
  Comparação do password recebido pelo cliente com o hash gerado pelo bcrypt
  */
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
export default User;
