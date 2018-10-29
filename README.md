# Simple Blockchain

This project aims to complete the Udaciy Blockchain Nanodegree

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Node V10.9.0+

```
brew install nvm
nvm install stable
```

### Installing

A step by step to get up and running.

```
npm install
npm start
```

## API Endpoint

The following endpoints are available:

| Endpoints                 | Usage                       | Params              |
| ------------------------- | --------------------------- | ------------------- |
| `GET /block/:blockHeight` | Get the details of a block. |                     |
| `POST /block`             | Add a new block.            | **body** - [String] |

## Running the tests

This project make use of jest platform for unit tests. To run the tests, follow the instructions bellow:

```
npm test
```

## Deployment

This project will use Docker container in the future.

## Built With

- [Hapi](https://hapijs.com) - The web framework used
- [Jest](https://jestjs.io) - The test framework

## Authors

- **Fernando Farias** - _Initial work_ - [nandofarias](https://github.com/nandofarias)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- [Udacity Blockchain Nanodegree](https://br.udacity.com/course/blockchain-developer-nanodegree--nd1309)
