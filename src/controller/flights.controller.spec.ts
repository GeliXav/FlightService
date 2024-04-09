import { FlightService } from '../service/flight.service';
import { FlightController } from './flight.controller';
import { FlightResponse } from 'src/model/flight.model';
import { flightsData } from '../../test/flights';
import { Test } from '@nestjs/testing';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';

describe('FlightsController', () => {
  let flightController: FlightController;
  let flightService: FlightService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FlightController],
      providers: [FlightService],
      imports: [HttpModule, CacheModule.register()],
    }).compile();

    flightService = moduleRef.get<FlightService>(FlightService);
    flightController = moduleRef.get<FlightController>(FlightController);
  });

  describe('findAll', () => {
    it('should return flights', async () => {
      const flights: FlightResponse = {
        ...flightsData,
      };
      jest.spyOn(flightService, 'getFlights').mockResolvedValue(flights);

      expect(await flightController.getFlights()).toBe(flights);
    });
  });
});
