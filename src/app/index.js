import React from 'react';
import { BrowserRouter, Match, Miss, Link } from 'react-router'
import _ from 'lodash';
import GoogleLogin from 'react-google-login';
import styles from './app.scss';
import BeerSearch from './components/BeerSearch';
import BeerWishList from './components/BeerWishList';
import GoogleLogout from './components/GoogleLogout';
import Service from './Services/Service';

const App = React.createClass({

  getInitialState() {
    const setUser = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
    return (
    {
      onTap: [],
      numberOfTaps: 6,
      tapList: [],
      beerWishList: [],
      user: setUser,
    }
    );
  },

  componentDidMount() {
    Service.getWishList().then((data) => {
      this.setState({ ...this.state, beerWishList: data });
    });
    Service.getOnTap().then((data) => {
      const tapList = _.orderBy(data, 'tap');
      this.buildTaps(tapList);
    });
  },

  buildTaps(data) {
    let i = 1;
    const tapList = [];
    console.log(this.state.numberOfTaps);
    while (i <= this.state.numberOfTaps) {
      const retBeer = ({ tap: i, beer: null });
      tapList.push(retBeer);
      i++;
    }

    _.each(data, (beer) => {
      return _.find(tapList, (tap) => {
        if (tap.tap === beer.tap) {
          tap.beer = beer;
        }
      });
    });
    this.setState({ ...this.state, tapList });
  },

  responseGoogle(response) {
    this.setState({ ...this.state, user: response.profileObj });
    sessionStorage.setItem('user', JSON.stringify(response.profileObj));
  },

  googleLogout() {
    sessionStorage.setItem('user', null);
    this.setState({
      ...this.state,
      user: null,
    });
  },

  NoMatch({ location }) {
    return (
      <div>
        <h2>Whoops</h2>
        <p>Sorry but {location.pathname} didn’t match any pages</p>
      </div>
    );
  },


  renderTaps() {
    return this.state.tapList.map((beer) => {
      return (
        <BeerSearch
          key={beer.tap}
          position={beer.tap}
          onTapItem={beer.beer}
          user={this.state.user}
        />
      );
    });
  },

  renderUser() {
    return (
      <div>
        <img width='25px' height='25px' className={styles.pic} alt='' src={this.state.user.imageUrl} />
        <div className={styles.userName}>
          {this.state.user.name}
        </div>
      </div>
    );
  },

  renderWishList() {
    return (
      <BeerWishList beerWishList={this.state.beerWishList} user={this.state.user} />
    );
  },

  Home() {
    return (
      <div className={`${styles.beerTaps}`}>
        {
          this.renderTaps()
        }
      </div>
    );
  },

  render() {
    return (
      <BrowserRouter>
        <div className={`${styles.appWrapper}`}>
          <div className={styles.userHeader}>
            <div className={`col-md-4 col-sm-12 col-xs12 ${styles.login}`}>
            {!this.state.user &&
              <GoogleLogin
                clientId='242097175438-ji2if1pna4filr4vmfh8gn642o9jgadg.apps.googleusercontent.com'
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                className={styles.googleLogin}
              >
                <i className='fa fa-google' aria-hidden='true' />
                {' Login'}
              </GoogleLogin>
            }
            {this.state.user &&
              <GoogleLogout onClick={this.googleLogout} />
            }
            </div>
            <div className='col-md-4 col-sm-12 col-xs12'>
              <img className={styles.logoPic} src='/img/BoomTap-logo.png' alt='tap' />
            </div>
            <div className={`col-md-4 col-sm-12 col-xs12 ${styles.user}`}>
              {this.state.user &&

                this.renderUser()
              }
            </div>
          </div>
          <Match exactly pattern='/' component={this.Home} />
          <Match pattern='/beerwishlist' component={this.renderWishList} />

          <Miss component={this.NoMatch} />
        </div>
      </BrowserRouter>
    );
  },
});

export default App;
