import supertest from 'supertest';
import { app } from '../src/application/app';
import { logger } from '../src/application/logging';
import { UserTest } from './test-util';
import { prisma } from '../src/application/database';

describe('POST /api/users', () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should reject register user if request invalid', async () => {
    const response = await supertest(app)
      .post('/api/users')
      .send({ username: '', password: '', name: '' });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should register new user', async () => {
    const response = await supertest(app)
      .post('/api/users')
      .send({ username: 'test', password: 'test', name: 'test' });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe('test');
    expect(response.body.data.name).toBe('test');
  });
});
