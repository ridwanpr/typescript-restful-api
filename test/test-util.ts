import { prisma } from '../src/application/database';
import bcrypt from 'bcrypt';

export class UserTest {
  static async delete() {
    await prisma.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  static async create() {
    await prisma.user.create({
      data: {
        username: 'test',
        password: await bcrypt.hash('test', 10),
        name: 'test',
        token: 'test',
      },
    });
  }
}
