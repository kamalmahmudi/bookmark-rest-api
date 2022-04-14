# Bookmark REST API

## Description

This is just a simple bookmark backend using [NestJS](https://nestjs.com/) as framework.

## Installation

```bash
$ yarn
```

## Starting db (using docker-compose)

```bash
# development
$ yarn db:dev:up

# testing
$ yarn db:test:up
```

## Running the migration

```bash
# development
$ yarn prisma:dev:deploy

# testing
$ yarn prisma:test:deploy
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Other scripts

See [package.json](package.json)

## References

- [freeCodeCamp.org](https://www.youtube.com/watch?v=GHTA143_b-s)
- [NestJS](https://docs.nestjs.com/)
- [Prisma](https://www.prisma.io/docs/)
- [Jest](https://jestjs.io/docs/getting-started)
- [Docker](https://docs.docker.com/)