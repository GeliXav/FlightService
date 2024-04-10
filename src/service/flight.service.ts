import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { Flight, FlightResponse } from '../model/flight.model';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class FlightService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
  ) {}

  async getFlights(): Promise<FlightResponse> {
    const flightSources = process.env.FLIGHT_URLS;

    if (!flightSources) {
      console.error(
        'There are no flight sources available. Please provide the flight sources in the environment variable FLIGHT_URLS.',
      );
      throw Error('There are no flight sources available.');
    }
    const promiseGetFlights = [];
    const flightUrls = flightSources.split(',');
    for (const url of flightUrls) {
      promiseGetFlights.push(this.getFlightFromUrl(url, Number(process.env.TIMEOUT_MS) / flightUrls.length));
    }

    const responses = await Promise.all(promiseGetFlights);
    const mergedFlights = responses.flat();
    const flightsWithoutDuplicates = this.removeDuplicates(mergedFlights);
    return { flights: flightsWithoutDuplicates };
  }

  private removeDuplicates(flights: Flight[]): Flight[] {
    const duplicateFlights = [];
    const uniqueFlights = [];
    flights.forEach((flight) => {
      const flightIdentifier = this.getFlightIdentifier(flight);
      if (duplicateFlights.includes(flightIdentifier)) {
        return;
      }
      duplicateFlights.push(flightIdentifier);
      uniqueFlights.push(flight);
    });
    return uniqueFlights;
  }

  private getFlightIdentifier(flight: Flight): string {
    const identifier = flight.slices
      .map((slice) => slice.flight_number + slice.departure_date_time_utc)
      .join();
    return identifier;
  }

  private async getFlightFromUrl(url: string, timeout: number): Promise<Flight[]> {
    const cachedFlights = (await this.cacheManager.get(url)) as Flight[];
    const cacheTTL = process.env.CACHE_TTL;
    if (cachedFlights) {
      console.debug('Flights retrieved from cache');
      return cachedFlights;
    }
    let flights = [];
    try {
      flights = (
        await this.httpService.axiosRef({
          url: url,
          method: 'GET',
          timeout: timeout,
        })
      ).data.flights;
      await this.cacheManager.set(url, flights, Number(cacheTTL));
    } catch (error) {
      console.error('The flight could not be retrieved from the url: ' + url);
    }
    return flights;
  }
}
