# Flights PowerUs 🛫

This repository contains a service to fetch flights from multiple sources. It will merge flights and remove duplicates.
You can find the routing in `flight.controller.ts` ` GET /flights`.
The FlightService then contains the logic for fetching data and removing duplicates. If one of the provider we fetch data to is down, we then return empty for the data it should provide.

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
