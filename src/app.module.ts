import { Module } from '@nestjs/common';
import { FlightsController } from './controller/flights.controller';
import { FlightService } from './service/flight.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, CacheModule.register()],
  controllers: [FlightsController],
  providers: [FlightService],
})
export class AppModule {}
