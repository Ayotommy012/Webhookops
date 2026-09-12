import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, VersioningType } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

interface LoginResponseBody {
  accessToken: string;
}
describe('HealthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');

    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/health (GET)', () => {
    return request(app.getHttpServer()).get('/api/v1/health').expect(200);
  });
  it('rejects access to /api/v1/auth/me without a token', () => {
    return request(app.getHttpServer()).get('/api/v1/auth/me').expect(401);
  });
  it('rejects an invalid access token', () => {
    return request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });
  it('allows access with a valid token', async () => {
    const email = `jwt-test-${Date.now()}@webhookops.dev`;
    const password = 'WebhookOps123!';

    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        name: 'JWT Test User',
        email,
        password,
      })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email,
        password,
      })
      .expect(201);

    const loginBody = loginResponse.body as unknown as LoginResponseBody;
    const accessToken = loginBody.accessToken;

    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
