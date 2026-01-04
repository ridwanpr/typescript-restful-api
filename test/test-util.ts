import { prisma } from '../src/application/database';
import bcrypt from 'bcrypt';
import { Contact, User } from '../src/generated/prisma/client';

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

  static async get(): Promise<User> {
    const user = await prisma.user.findFirst({
      where: {
        username: 'test',
      },
    });

    if (!user) {
      throw new Error('Test user is not found');
    }

    return user;
  }
}

export class ContactTest {
  static async deleteAll() {
    await prisma.contact.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  static async create() {
    await prisma.contact.create({
      data: {
        first_name: 'test',
        last_name: 'test',
        email: 'test@example.com',
        phone: '08132131312',
        username: 'test',
      },
    });
  }

  static async get(): Promise<Contact> {
    const contact = await prisma.contact.findFirst({
      where: {
        username: 'test',
      },
    });

    if (!contact) throw new Error('Contact is not found');
    return contact;
  }
}
