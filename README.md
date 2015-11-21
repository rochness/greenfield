# Converge

## Team

  - __Product Owner__: Cheyenne Kellis
  - __Scrum Master__: Ammar Mian
  - __Development Team Members__: Rochelle Lee, Thomas Sorensen

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

npm install at the root to deploy all dependencies. Npm start from the root will deploy the server

## Requirements

- npm

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
```
### Sample API Requests

Our app utilizes the Foursquare API to find nearby restaurants, bars, and coffeeshops.
You should use Postman to practice making requests to our server to see how this works.

```
// POST request to localhost:8000/api/search (**using Postman**)

// params body (inserted as raw data):
{ 
  "query": "food", 
  "location": [37.780542, -122.412300], 
  "rating": 8, 
  "price": 1 
};

// results will look something like:
{ results: [an array of places you should totally eat at...] };
```



### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


## Contributing

See [CONTRIBUTING.md](_CONTRIBUTING.md) for contribution guidelines.
