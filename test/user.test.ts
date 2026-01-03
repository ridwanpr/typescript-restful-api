import supertest from 'supertest';
import { app } from '../src/application/app';
import { logger } from '../src/application/logging';
import { UserTest } from './test-util';
import { prisma } from '../src/application/database';
import bcrypt from 'bcrypt';

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

describe('POST /api/users/login', () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should be able to login', async () => {
    const response = await supertest(app).post('/api/users/login').send({
      username: 'test',
      password: 'test',
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe('test');
    expect(response.body.data.name).toBe('test');
    expect(response.body.data.token).toBeDefined();
  });

  it('should be reject login if username is wrong', async () => {
    const response = await supertest(app).post('/api/users/login').send({
      username: 'wrongusername',
      password: 'test',
    });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it('should be reject login if password is wrong', async () => {
    const response = await supertest(app).post('/api/users/login').send({
      username: 'test',
      password: 'wrongpassword',
    });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe('GET /api/users/current', () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should be able to get current user', async () => {
    const response = await supertest(app).get('/api/users/current').set('X-API-TOKEN', 'test');

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe('test');
    expect(response.body.data.name).toBe('test');
  });

  it('should reject get current user if token invalid', async () => {
    const response = await supertest(app)
      .get('/api/users/current')
      .set('X-API-TOKEN', 'invalid token');

    logger.debug(response.body);

    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe('PATCH /api/users/current', () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should reject update user if request is invalid', async () => {
    const response = await supertest(app)
      .patch('/api/users/current')
      .set('X-API-TOKEN', 'test')
      .send({
        name: '',
        password: '',
      });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should reject update user if auth token is invalid', async () => {
    const response = await supertest(app)
      .patch('/api/users/current')
      .set('X-API-TOKEN', 'wrong token')
      .send({
        name: 'correct name',
        password: 'correct password',
      });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it('should be able to update user name', async () => {
    const response = await supertest(app)
      .patch('/api/users/current')
      .set('X-API-TOKEN', 'test')
      .send({
        name: 'update name',
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe('update name');
  });

  it('should be able to update user password', async () => {
    const response = await supertest(app)
      .patch('/api/users/current')
      .set('X-API-TOKEN', 'test')
      .send({
        password: 'correct',
      });

    logger.debug(response.body);

    const user = await UserTest.get();
    expect(await bcrypt.compare('correct', user.password)).toBe(true);

    expect(response.status).toBe(200);
  });
});

describe('DELETE /api/users/current', () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should be able to logout', async () => {
    const response = await supertest(app).delete('/api/users/current').set('X-API-TOKEN', 'test');

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data).toBe('OK');

    const user = await UserTest.get();
    expect(user.token).toBe(null);
  });

  it('should reject user logout if token is invalid', async () => {
    const response = await supertest(app)
      .delete('/api/users/current')
      .set('X-API-TOKEN', 'invalid token');

    logger.debug(response.body);

    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});
