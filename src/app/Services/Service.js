import _ from 'lodash';
import fetch from '../lib/fetch';

const Service = {
  searchBeers(term) {
    const url = '/admin/beer/';
    return fetch.post(url, { searchParam: term }).then((data) => {
      const listItems = [];
      data.items.forEach((beer) => {
        listItems.push({ value: beer, text: beer.beer.beer_name });
      });
      return listItems;
    });
  },
  saveTap(tap, bid, params) {
    const url = `/admin/beer/${tap}/${bid}`;
    return fetch.post(url, params).then((res) => {
      return res;
    });
  },
  tapped(id) {
    const url = `/beers/tapped/${id}`;
    return fetch.get(url).then((res) => {
      return res;
    });
  },

  deleteTap(tap, params) {
    const url = `/admin/tap/delete/${tap}`;
    return fetch.post(url, params).then((res) => {
      return res;
    }).catch((err) => {
      return err;
    });
  },
  getOnTap() {
    const url = '/beers';
    return fetch.get(url).then((res) => {
      return res;
    });
  },
  getWishList() {
    const url = '/wishlist/beers';
    return fetch.get(url).then((res) => {
      return _.orderBy(res, (b) => {
        return b.votes.total || 0;
      }, ['desc']);
    }).catch((err) => {
      return err;
    });
  },
  SaveToWishList(bid, params) {
    const url = `/wishlist/beer/${bid}`;
    return fetch.post(url, params).then((res) => {
      return res;
    });
  },
  wishListVote(bid, params) {
    const url = `/wishlist/beers/vote/${bid}`;
    const newParams = {
      votes: params,
      bid,
    };
    return fetch.post(url, newParams).then((res) => {
      return res;
    });
  },
  deleteFromWishlist(params) {
    const id = params.beer.bid;
    const url = `/wishlist/beer/delete/${id}`;
    return fetch.post(url, params).then((res) => {
      return res;
    }).catch((err) => {
      return err;
    });
  },
};

export default Service;
