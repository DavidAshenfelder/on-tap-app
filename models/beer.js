var mongoose = require('mongoose');

var beerSchema = new mongoose.Schema({
  bid: Number,
  beer_name: String,
  beer_label: String,
  beer_abv: Number,
  beer_ibu: String,
  beer_description: String,
  beer_style: String,
  brewery_name: String,
  brewery_label: String,
  country_name: String,
  brewery_city: String,
  brewery_state: String,
  brewery_url: String,
  tap: Number,
  tapped: Boolean,
  dateAdded: Date,
  dateKicked: Date,
});

module.exports = mongoose.model('OnTapBeer', beerSchema);
