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
Unit tests are provided for both service and controller. You also have an e2e test that checks if the data is correct for those urls. 

## Caching
The data we fetch from the flight services will be cached in memory. This is a memory cache, so it will be deleted on restart and we'll have to recache data again. Caching TTL is 1 hour.

## Config
There are two config available in .env file. You can specify new url to fetch data from, and specify the cache ttl.
