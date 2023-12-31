import request from 'supertest';
import app from '../src/index';
import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import { faker } from '@faker-js/faker/locale/en_IN';
import { Server, IncomingMessage, ServerResponse } from 'http';

let server: Server<typeof IncomingMessage, typeof ServerResponse>;
beforeAll(async () => {
  server = app.listen(3000);
});

describe('Test the auth routes', () => {
  test('Register should return 201', async () => {
    const response = await request(app).post('/auth/register').send({
      email: 'nabhan.hanif@icloud.com',
      password: 'Test123',
      name: 'Nabhan Hanif'
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
  });

  test('Register should return 400', async () => {
    const response = await request(app).post('/auth/register').send({
      email: faker.internet.email(),
      password: faker.internet.password()
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
  });

  test('Login should return 200', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'nabhan.hanif@icloud.com',
      password: 'Test123'
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  test('Login should return 400', async () => {
    const response = await request(app).post('/auth/login').send({
      email: faker.internet.email(),
      password: faker.internet.password()
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
  });
});

afterAll(async () => {
  server.close();
});
