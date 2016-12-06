# App Purpose

* This app was developed to provide an online place to view what beers are on tap at any give time.
* All users can view the taps and the beers on tap at any given point.
* Only admin users (those users that know the password) will be able to add beers on tap and
remove beers from a tap.
* There is slack integration that will alert designated slack channels when certain things happen in the app.
  1. When a keg is added to a tap.
  2. When a keg is kicked.
  3. When a keg is taken off tap.
* All uses can click the `Kicked Keg` button to notify all appropriate channels on slack that the keg is kicked.
* Only admin users can delete the beer from that keg.
* A password of choosing will need be set in the environment variables. There is no encryption of this password, but the
password that is sent to add a beer and remove a beer must match in order for the action to happen.

# App Setup

## Dev

This app is built with React front end and express/node backend.

To change develop on this project run `npm run dev` and this will watch files via webpack.
This command will also start the express server which will listen on `localhost:3000`.
Changes for both the front and back end code is watched and will change in real time, to see the changes
just refresh the page.

* there is no flux structure in this app, but if it were to scale this may be something to think about.
* Because of the size of it for now, we thought that would be overkill.

## Production
On the production environment the command `npm run prod` will need to be run to start the express/node server.

## File Structure
* Server.js
* beer.js (schema)
* public
  * dist
    * css
    * js
  * img
    * header image
* src
  * app.js
  * app
    index.js
    app.scss
    * action (currently empty)
    * components
      * Global
      * BeerSearch
    * containers (currently empty)
    * lib
    * Services
      * Service.js
    * Styles



# Endpoints

## Search Beers

### POST `/admin/beers/`

Request: `curl -X POST -H "Content-Type: application/json" -d '{"searchParam":"<beer name>", "password":<admin password>}' "http://localhost:3000/admin/beer/"`

Response: Returns a list of beers in this format:

```
{
    "count": 4,
    "items": [
        {
            "beer": {},
            "brewery": {},
            "checkin_count": 4331,
            "have_had": false,
            "your_count": 0
        }, ...
}
```

## Add Beer

### POST `/admin/beer/:tap/:id`

Request: `curl -X POST -H "Content-Type: application/json" -d '{"password":<admin password>}' "http://localhost:3000/admin/beer/1/813283"`

Reponse: `Successfully saved Kolsch to 1 tap`

Starting from left, taps are labelled 1 (Left), 2 (Middle), 3 (Right).

## Delete Beer

### POST `/admin/beer/:id`

Request: `curl -X POST -H "Content-Type: application/json" -d '{"password":<admin password>}' "http://localhost:3000/admin/beer/delete/813283"`

Response: `Successfully deleted beer`

## Get Current Beers

### GET `/beers`

Request: `curl http://localhost:3000/beers`

Response: Returns a list of beers in this format:

```[
  {
    "_id": "57eeb2a2ad125c3142565c5b",
    "bid": 813283,
    "beerName": "Kolsch",
    "beerLabel": "https://untappd.akamaized.net/site/assets/images/temp/badge-beer-default.png",
    "beerABV": 4.2,
    "beerIBU": "0",
    "beerDescription": "",
    "beerStyle": "Kölsch",
    "breweryName": "COAST Brewing Company",
    "breweryLabel": "https://untappd.akamaized.net/site/brewery_logos/brewery-388_5ba60.jpeg",
    "countryName": "United States",
    "breweryCity": "North Charleston",
    "breweryState": "SC",
    "tap": 2,
    "tapped": false,
    "dateAdded": "2016-09-30T18:44:50.579Z",
    "dateKicked": null,
    "__v": 0
  },
  ...
]
```

## Kicked tap

### GET `/beers/tapped/:id`

Request: `curl http://localhost:3000/beers/tapped/813283`

Response:

```
{
  "_id": "57eeb2a2ad125c3142565c5b",
  "bid": 813283,
  "beerName": "Kolsch",
  "beerLabel": "https://untappd.akamaized.net/site/assets/images/temp/badge-beer-default.png",
  "beerABV": 4.2,
  "beerIBU": "0",
  "beerDescription": "",
  "beerStyle": "Kölsch",
  "breweryName": "COAST Brewing Company",
  "breweryLabel": "https://untappd.akamaized.net/site/brewery_logos/brewery-388_5ba60.jpeg",
  "countryName": "United States",
  "breweryCity": "North Charleston",
  "breweryState": "SC",
  "tap": 2,
  "tapped": true,
  "dateAdded": "2016-09-30T18:44:50.579Z",
  "dateKicked": "2016-09-30T18:49:21.013Z",
  "__v": 0
}
```
