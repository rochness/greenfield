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
### Reading Data

The array of restaurants you get back contains a lot of data.

```
{ results: [restaurant1, restaurant2, restaurant3, ...] }
```

Here's a quick list on properties you can access for any given restaurant:

```
// var sampleRestaurant = results[0] -- first restaurant in the array

sampleRestaurant.venue.price.tier // a value between 1 and 4, inclusive
sampleRestaurant.venue.rating // a value between 0 and 10
sampleRestaurant.venue // all other properties you'd want (name, address, price, rating, etc)



### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


## Contributing

See [CONTRIBUTING.md](_CONTRIBUTING.md) for contribution guidelines.
