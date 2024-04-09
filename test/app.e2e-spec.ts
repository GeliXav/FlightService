import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { flightResponse } from './flights';

describe('FlightController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    process.env.FLIGHT_URLS =
      'https://coding-challenge.powerus.de/flight/source1,https://coding-challenge.powerus.de/flight/source2';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/flights')
      .expect(200)
      .expect(flightResponse);
  });
});
