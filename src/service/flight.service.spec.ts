import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { FlightService } from './flight.service';
import { CacheModule } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { flightsData, flightsData2 } from '../../test/flights'


describe('PokemonService', () => {
  let flightService: FlightService; // renamed variable to pokemonService
  let httpService: DeepMocked<HttpService>;
  let cacheService: DeepMocked<Cache>;
  process.env.CACHE_TTL = '60';

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlightService,
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
      ],
      imports: [CacheModule.register()],
    }).compile();

    flightService = module.get<FlightService>(FlightService);
    httpService = module.get(HttpService);
  
  });

  it('Flights are returned from a single source', async () => {
    process.env.FLIGHT_URLS = 'https://test.com';
    httpService.axiosRef.mockResolvedValue({
        data: {
          ...flightsData
        },
        headers: {},
        config: { url: '' },
        status: 200,
        statusText: '',
      });

      const flightResponse = await flightService.getFlights();

      expect(flightResponse).toEqual(flightsData);
    
  });

  it('Flights are merged from multiple sources', async () => {
    process.env.FLIGHT_URLS = 'https://test.com,https://test2.com';
    httpService.axiosRef.mockResolvedValueOnce({
        data: {
          ...flightsData
        },
        headers: {},
        config: { url: '' },
        status: 200,
        statusText: '',
      }).mockResolvedValueOnce({
        data: {
          ...flightsData2
        },
        headers: {},
        config: { url: '' },
        status: 200,
        statusText: '',
      });

      const flightResponse = await flightService.getFlights();
      expect(flightResponse.flights.length).toEqual(4);
    
  });

  it('Flights are merged from multiple sources and duplicates are removed', async () => {
    process.env.FLIGHT_URLS = 'https://test.com,https://test2.com';
    httpService.axiosRef.mockResolvedValueOnce({
        data: {
          ...flightsData
        },
        headers: {},
        config: { url: '' },
        status: 200,
        statusText: '',
      }).mockResolvedValueOnce({
        data: {
          ...flightsData
        },
        headers: {},
        config: { url: '' },
        status: 200,
        statusText: '',
      });

      const flightResponse = await flightService.getFlights();
      expect(flightResponse.flights.length).toEqual(2);  
  });

  it('Flights are returned from cache if available', async () => {
    process.env.FLIGHT_URLS = 'https://test.com';
    httpService.axiosRef.mockResolvedValueOnce({
      data: {
        ...flightsData
      },
      headers: {},
      config: { url: '' },
      status: 200,
      statusText: '',
    }).mockResolvedValueOnce({
      data: {
        ...flightsData2
      },
      headers: {},
      config: { url: '' },
      status: 200,
      statusText: '',
    });

    const flightResponse = await flightService.getFlights();
    expect(flightResponse).toEqual(flightsData);
    const cachedFlightResponse = await flightService.getFlights();
    expect(cachedFlightResponse).toEqual(flightsData);
  });

});