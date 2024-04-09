# Flights PowerUs 🛫

This repository hosts a service designed to retrieve flight information from various sources. The service consolidates flight data from these sources, eliminating duplicates in the process.

You can locate the routing for accessing flight data in flight.controller.ts, specifically under the `GET /flights` endpoint.

The `FlightService` encapsulates the logic responsible for fetching flight data and handling duplicate removal. In case any of the data providers used for fetching flights are unavailable, the service gracefully returns empty data for the affected provider.

## Installation and running the app

```bash
$ npm install
$ npm run start
```
You can then curl `localhost:3000/flights`

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
Unit tests are available for both the service and controller. Additionally, an end-to-end (e2e) test verifies the correctness of data retrieved from the specified URLs.

## Caching
Data obtained from the flight services will be cached in memory. This cache operates in-memory and will be cleared upon restart, necessitating the recaching of data. The Time-To-Live (TTL) for caching is set to 1 hour.

## Configuration
The .env file contains two configurable parameters. You can specify new URLs from which to fetch data and adjust the cache TTL according to your requirements.
