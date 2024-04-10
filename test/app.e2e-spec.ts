import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {
  DelayType,
  IWireMockRequest,
  IWireMockResponse,
  WireMock,
} from 'wiremock-captain';
import { expectedResponse, flights1E2E, flights2E2E } from './e2e-flights';

describe('FlightController (e2e)', () => {
  let app: INestApplication;

  const wiremockEndpoint = 'http://localhost:8080';
  const mock = new WireMock(wiremockEndpoint);

  beforeEach(async () => {
    process.env.FLIGHT_URLS = `${wiremockEndpoint}/flights, ${wiremockEndpoint}/flights2`;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/flights returns 200 and is less than 1s', async () => {
    const mockRequest: IWireMockRequest = {
      method: 'GET',
      endpoint: '/flights',
    };
    const response: IWireMockResponse = {
      status: 200,
      body: { ...flights1E2E },
    };

    const mockRequest2: IWireMockRequest = {
      method: 'GET',
      endpoint: '/flights2',
    };

    const response2: IWireMockResponse = {
      status: 200,
      body: { ...flights2E2E },
    };

    await mock.register(mockRequest, response);
    await mock.register(mockRequest2, response2);

    console.log(expectedResponse.flights.length);

    return request(app.getHttpServer())
      .get('/flights')
      .expect(200)
      .timeout(1000)
      .expect({ ...expectedResponse });
  });

  it('/flights one request fail and still returns', async () => {
    const mockRequest: IWireMockRequest = {
      method: 'GET',
      endpoint: '/flights',
    };
    const response: IWireMockResponse = {
      status: 200,
      body: { ...flights1E2E },
    };

    const mockRequest2: IWireMockRequest = {
      method: 'GET',
      endpoint: '/flights2',
    };

    const response2: IWireMockResponse = {
      status: 500,
      body: { "error" : "Internal Server Error"},
    };

    await mock.register(mockRequest, response);
    await mock.register(mockRequest2, response2);
    return request(app.getHttpServer())
      .get('/flights')
      .expect(200)
      .timeout(1000)
      .expect({ ...flights1E2E });
  });

  it('/flights one request takes longer than 1000ms and still returns', async () => {
    const mockRequest: IWireMockRequest = {
      method: 'GET',
      endpoint: '/flights',
    };
    const response: IWireMockResponse = {
      status: 200,
      body: { ...flights1E2E },
    };

    const mockRequest2: IWireMockRequest = {
      method: 'GET',
      endpoint: '/flights2',
    };

    const response2: IWireMockResponse = {
      status: 500,
      body: { ...flights2E2E},
    };

    await mock.register(mockRequest, response);
    await mock.register(mockRequest2, response2, {
      responseDelay: {
        type: DelayType.FIXED,
        constantDelay: 1100,
      },
    });
    return request(app.getHttpServer())
      .get('/flights')
      .expect(200)
      .timeout(1000)
      .expect({ ...flights1E2E });
  });
});
