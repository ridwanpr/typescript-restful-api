import supertest from 'supertest';
import { prisma } from '../src/application/database';
import { ContactTest, UserTest } from './test-util';
import { app } from '../src/application/app';
import { logger } from '../src/application/logging';

describe('POST /api/contacts', () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create new contact', async () => {
    const response = await supertest(app).post('/api/contacts').set('X-API-TOKEN', 'test').send({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@gmail.com',
      phone: '0876543212',
    });

    // logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.first_name).toBe('John');
    expect(response.body.data.last_name).toBe('Doe');
    expect(response.body.data.email).toBe('johndoe@gmail.com');
    expect(response.body.data.phone).toBe('0876543212');
  });

  it('should reject create new contact if data is invalid', async () => {
    const response = await supertest(app).post('/api/contacts').set('X-API-TOKEN', 'test').send({
      first_name: '',
      last_name: '',
      email: 'gmail.com',
      phone: '22222222222222222222222222222222',
    });

    // logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});
