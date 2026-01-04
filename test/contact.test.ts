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
    const response = await supertest(app)
      .post('/api/contacts')
      .set('X-API-TOKEN', 'test')
      .send({
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
    const response = await supertest(app)
      .post('/api/contacts')
      .set('X-API-TOKEN', 'test')
      .send({
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

describe('GET /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should be able to get contacts', async () => {
    const contact = await ContactTest.get();
    const response = await supertest(app)
      .get(`/api/contacts/${contact.id}`)
      .set('X-API-TOKEN', 'test');

    // logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.first_name).toBe(contact.first_name);
    expect(response.body.data.last_name).toBe(contact.last_name);
    expect(response.body.data.email).toBe(contact.email);
    expect(response.body.data.phone).toBe(contact.phone);
  });

  it('should reject get contacts if contact not found', async () => {
    const contact = await ContactTest.get();
    const response = await supertest(app)
      .get(`/api/contacts/${contact.id + 99}`)
      .set('X-API-TOKEN', 'test');

    // logger.debug(response.body);

    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});
