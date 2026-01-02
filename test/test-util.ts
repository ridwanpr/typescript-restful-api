import { prisma } from '../src/application/database';

export class UserTest {
  static async delete() {
    await prisma.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }
}
