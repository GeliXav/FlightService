import { Controller, Get } from '@nestjs/common';
import { FlightService } from '../service/flight.service';
import { FlightResponse } from '../model/flight.model';

@Controller()
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get('/flights')
  async getFlights(): Promise<FlightResponse> {
    return this.flightService.getFlights();
  }
}
