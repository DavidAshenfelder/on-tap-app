const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config');
const request = require('request');
const moment = require('moment');
// const slackbot = require('slackbots');
const Beer = require('./models/beer');
const WishList = require('./models/beerWishList');

const untappdURL = 'https://api.untappd.com/v4';
const clientId = config.clientId;
const clientSecret = config.clientSecret;
const adminPassword = config.adminPassword;

const app = express();

mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

// const BeerBot = new slackbot({
//     token: config.beerbotToken,
//     name: config.beerbotName
// });
//
// BeerBot.on('start', function() {
//   console.log('BeerBot is up!');
// });

app.set('port', config.port);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Search for beer
app.post('/admin/beer', (req, res, next) => {
  const searchParam = req.body.searchParam;
  request(`${untappdURL}/search/beer/?client_id=${clientId}&client_secret=${clientSecret}&q=${searchParam}`, (err, response, body) => {
    if (err) return next({ err });
    res.send(JSON.parse(response.body).response.beers);
  });
});

// Add beer (:id) to tap (:tap)
app.post('/admin/beer/:tap/:id', (req, res, next) => {
  if(req.body.password !== adminPassword) return next(new Error('You are not worthy!'));
  request(`${untappdURL}/beer/info/${req.params.id}?client_id=${clientId}&client_secret=${clientSecret}`, (err, response, body) => {
    if(err) return next({ err });
    body = JSON.parse(body).response.beer;
    const beer = new Beer({
      bid: body.bid,
      beer_name: body.beer_name,
      beer_label: body.beer_label,
      beer_abv: body.beer_abv,
      beer_ibu: body.beer_ibu,
      beer_description: body.beer_description,
      beer_style: body.beer_style,
      brewery_name: body.brewery.brewery_name,
      brewery_label: body.brewery.brewery_label,
      country_name: body.brewery.country_name,
      brewery_city: body.brewery.location.brewery_city,
      brewery_state: body.brewery.location.brewery_state,
      brewery_url: body.brewery.contact.url,
      tap: req.params.tap,
      tapped: false,
      dateAdded: moment(),
      dateKicked: null,
    });
    beer.save(function (err) {
      if(err) return next({ err });
      // const sendChannel = process.env.NODE_ENV == 'production' ? config.beerbotChannels.general : config.beerbotChannels.boomtap;
      // BeerBot.postMessageToChannel(sendChannel, `Tap ${req.params.tap}: ${beer.brewery_name} ${beer.beer_name} is now on tap`, config.beerbotParams);
      res.send({ status: 200, response: { beer, text: `Successfully saved ${body.beer_name} to ${req.params.tap} tap` } });
    });
  });
});

// Add beer (:id) to wishlist
app.post('/wishlist/beer/:id', (req, res, next) => {
  // if(req.body.password !== adminPassword) return next(new Error('You are not worthy!'));
  request(`${untappdURL}/beer/info/${req.params.id}?client_id=${clientId}&client_secret=${clientSecret}`, (err, response, body) => {
    if (err) return next({ err });
    body = JSON.parse(body).response.beer;
    const beer = new WishList({
      bid: body.bid,
      beer_name: body.beer_name,
      beer_label: body.beer_label,
      beer_abv: body.beer_abv,
      beer_ibu: body.beer_ibu,
      beer_description: body.beer_description,
      beer_style: body.beer_style,
      brewery_name: body.brewery.brewery_name,
      brewery_label: body.brewery.brewery_label,
      country_name: body.brewery.country_name,
      brewery_city: body.brewery.location.brewery_city,
      brewery_state: body.brewery.location.brewery_state,
      brewery_url: body.brewery.contact.url,
      tap: req.params.tap,
      tapped: false,
      dateAdded: moment(),
      dateKicked: null,
      votes: {
        total: 0,
        yes: [],
        no: [],
      },
    });
    beer.save((err) => {
      if (err) return next({ err });
      res.send({ status: 200, response: { beer, text: `Successfully saved ${body.beer_name} to wish list.` } });
    });
  });
});

// Delete beer by id from wishlist
app.post('/wishlist/beer/delete/:id', (req, res, next) => {
  console.log('body', req.body);
  if (req.body.password !== adminPassword) return next(new Error('You are not worthy!'));
  WishList.findOne({ bid: req.body.beer.bid }, (err, beer) => {
    if(err) return next({ err });
    console.log(beer);
    WishList.remove({ bid: req.body.beer.bid }, (err) => {
      if(err) return next({ err });
      res.send({ status: 200, response: `Successfully deleted beer` });
    });
  });
});

// Delete beer by tap
app.post('/admin/tap/delete/:tap', (req, res, next) => {
  console.log('body', req.body);
  if (req.body.password !== adminPassword) return next(new Error('You are not worthy!'));
  console.log("Tap: ", req.params.tap)
  Beer.findOne({ tap: req.params.tap }, (err, beer) => {
    if(err) return next({ err });
    console.log(beer);
    Beer.remove({ tap: req.params.tap }, (err) => {
      if(err) return next({ err });
      // const sendChannel = process.env.NODE_ENV == 'production' ? config.beerbotChannels.general : config.beerbotChannels.boomtap;
      // BeerBot.postMessageToChannel(sendChannel, `Tap ${req.params.tap}: ${beer.brewery_name} ${beer.beer_name} was taken off tap. Stay tuned for a new great beer coming soon.`, config.beerbotParams);
      res.send({ status: 200, response: `Successfully deleted beer` });
    });
  });
});

// Get all on tap beers
app.get('/beers', (req, res, next) => {
  Beer.find((err, beers) => {
    if(err) return next(err);
    res.send(beers);
  });
});

// Get all wishlist beers
app.get('/wishlist/beers', (req, res, next) => {
  WishList.find((err, beers) => {
    if (err) return next(err);
    const orderedBeers = _.orderBy(beers, (beer) => {
    });
    res.send(beers);
  });
});

// vote for beer.
app.post('/wishlist/beers/vote/:id', (req, res, next) => {
  WishList.findOneAndUpdate({
    bid: req.body.bid,
  }, {
    votes: req.body.votes,
  }, {
    new: true,
  }, (err, beer) => {
    if (err) return next(err);
    res.send(beer);
  });
});

// Mark beer as tapped/kicked.
app.get('/beers/tapped/:id', (req, res, next) => {
  Beer.findOneAndUpdate({
    bid: req.params.id
  }, {
    tapped: true,
    dateKicked: moment()
  }, {
    new: true
  }, (err, beer) => {
    if (err) return next(err);
    console.log(beer.dateKicked, beer.dateAdded);
    const diff = moment(beer.dateKicked, "DD/MM/YYYY HH:mm:ss").diff(moment(beer.dateAdded, "DD/MM/YYYY HH:mm:ss"));
    const secs = moment.duration(diff);
    console.log("secs", secs._milliseconds)
    const time = Math.floor(secs.asHours()) + moment.utc(diff).format(":mm:ss");
    console.log(`${beer.beerName} kicked after ${time}`);
    // const sendChannel = process.env.NODE_ENV == 'production' ? config.beerbotChannels.beerbarons : config.beerbotChannels.boomtap;
    // BeerBot.postMessageToChannel(sendChannel, `Tap ${beer.tap}: ${beer.brewery_name} ${beer.beer_name} kicked after ${time}`, config.beerbotParams);
    res.send(beer);
  });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

app.use('*', function(req, res, next) {
  res.sendFile(__dirname + '/public/index.html');
});
