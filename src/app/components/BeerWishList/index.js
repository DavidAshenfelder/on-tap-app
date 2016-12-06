import React, { PropTypes } from 'react';
import _ from 'lodash';
import Dropdown from '../Global/Dropdown';
import Service from '../../Services/Service';
import styles from './BeerWishList.scss';
import ConfirmModal from '../Global/ConfirmModal';
import Input from '../Global/Input';
import { mergeArray, deleteFromArray } from '../../lib/immutable';


const BeerWishList = React.createClass({
  propTypes: {
    beerWishList: PropTypes.array.isRequired,
    user: PropTypes.object,
  },

  getInitialState() {
    return {
      beerWishList: this.props.beerWishList,
      listIsOpen: false,
      searchTerm: '',
      selectedIndex: 0,
      selectedItem: null,
      modalIsOpen: false,
      password: '',
      isAdminProtected: false,
      duplicate: false,
      error: { error: false, errorMsg: '' },
      modalData: {
        headerText: '',
        bodyText: '',
        buttonText: '',
        buttonColor: '',
        actionHandler: () => { return null; },
      },
    };
  },

  componentWillReceiveProps(props) {
    this.setState({ ...this.state, beerWishList: props.beerWishList, user: props.user });
  },

  onHandleOpen() {
    this.setState({ ...this.state, listIsOpen: true });
  },

  onHandleClose() {
    this.setState({ ...this.state, listIsOpen: false, searchTerm: '', beerList: [] });
  },

  onChange(value) {
    clearTimeout(this.state.searchTimeout);
    const timeoutId = setTimeout(() => {
      this.searchForBeers();
    }, 1000);
    this.setState({ ...this.state, searchTerm: value, searchTimeout: timeoutId });
  },

  onInputKeyUp(index) {
    this.setState({ ...this.state, selectedIndex: index });
  },

  searchBeers(term) {
    Service.searchBeers(term).then((data) => {
      this.setState({ ...this.state, beerList: data });
    });
  },

  selectItem() {
    let inList = null;
    inList = _.findIndex(this.state.beerWishList, (beer) => {
      return beer.bid === this.state.beerList[this.state.selectedIndex].value.beer.bid;
    });
    const newState = {
      ...this.state,
      beerList: [],
      listIsOpen: false,
      searchTerm: '',
      selectedIndex: 0,
      selectedItem: this.state.beerList[this.state.selectedIndex],
    };
    if (inList !== -1) {
      newState.duplicate = true;
    }
    this.setState(newState);
  },

  searchForBeers() {
    this.searchBeers(this.state.searchTerm);
  },

  saveTap() {
    const bid = this.state.selectedItem.value.beer.bid;
    const params = { password: this.state.password };
    Service.SaveToWishList(bid, params).then((res) => {
      if (res.status === 200) {
        const newBeer = res.response.beer;
        const idx = this.state.beerWishList.length;
        let newWishList = mergeArray(this.state.beerWishList, idx, newBeer);
        newWishList = _.orderBy(newWishList, (b) => {
          return b.votes.total;
        }, ['desc']);
        this.setState(
          {
            ...this.state,
            beerWishList: newWishList,
            listIsOpen: false,
            searchTerm: '',
            selectedIndex: 0,
            selectedItem: null,
            onTapItem: null,
            modalIsOpen: false,
            password: '',
            error: { error: false, errorMsg: '' },
          }
        );
      }
    });
  },

  updateSelectedIndex(index) {
    this.setState({ ...this.state, selectedIndex: index });
  },

  remove() {
    this.setState({ ...this.state, selectedItem: null, duplicate: false });
  },

  passwordChange(password) {
    this.setState({ ...this.state, password, error: { error: false, errorMsg: '' } });
  },

  openModal(modalData, isAdminProtected) {
    this.setState({ ...this.state, modalIsOpen: true, modalData, isAdminProtected });
  },

  closeModal() {
    this.setState({
      ...this.state,
      modalIsOpen: false,
      password: '',
      error: {
        error: false,
        errorMsg: '',
      },
      modalData: {
        headerText: '',
        bodyText: '',
        buttonText: '',
        buttonColor: '',
        actionHandler: () => { return null; },
      },
    });
  },

  deleteModalData(beer, idx) {
    const beerName = beer ? `${beer.brewery_name} ${beer.beer_name}` : 'this beer';
    this.openModal({
      headerText: 'Delete',
      bodyText: `Delete ${beerName} from wish list?`,
      buttonText: 'Delete',
      buttonColor: 'danger',
      actionHandler: () => { this.delete(beer, idx); },
    }, true);
  },

  saveModalData() {
    const value = this.state.selectedItem.value;
    const beerName = this.state.selectedItem ? `${value.brewery.brewery_name} ${value.beer.beer_name}` : 'this beer';
    this.openModal({
      headerText: 'Save',
      bodyText: `Save ${beerName} to wish list?`,
      buttonText: 'Save',
      buttonColor: 'primary',
      actionHandler: this.saveTap,
    }, false);
  },

  delete(beer, idx) {
    const params = { beer, password: this.state.password };
    return Service.deleteFromWishlist(params).then((res) => {
      if (res.status === 200) {
        this.setState(
          {
            beerWishList: deleteFromArray(this.state.beerWishList, idx),
            beerList: [],
            listIsOpen: false,
            searchTerm: '',
            selectedIndex: 0,
            selectedItem: null,
            onTapItem: null,
            modalIsOpen: false,
            password: '',
            error: { error: false, errorMsg: '' },
          }
        );
      } else {
        this.setState({ error: { error: true, errorMsg: 'Incorrect password, please try again.' } });
      }
    });
  },

  calcVotePercent(votes, type) {
    const dec = (votes[type].length / (votes.yes.length + votes.no.length));
    const percent = isNaN(dec) ? 0 : dec * 100;
    return `${Math.round(percent)}%`;
  },

  calcVoteTally(votes) {
    const tally = (votes.yes.length - votes.no.length);
    return tally;
  },

  vote(beer, type, idx) {
    const other = type === 'yes' ? 'no' : 'yes';
    const userId = this.state.user.googleId;
    const newParams = Object.assign({}, beer.votes);
    if (!newParams[type].includes(userId)) {
      newParams[type].push(userId);
      newParams.total = this.calcVoteTally(newParams);
    }
    if (newParams[other].includes(userId)) {
      newParams[other] = deleteFromArray(newParams[other], newParams[other].indexOf(userId));
      newParams.total = this.calcVoteTally(newParams);
    }
    return Service.wishListVote(beer.bid, newParams).then((res) => {
      let newList = mergeArray(this.state.beerWishList, idx, res);
      newList = _.orderBy(newList, (b) => {
        return b.votes.total;
      }, ['desc']);
      this.setState({ ...this.state, beerWishList: newList });
    });
  },

  renderBeer() {
    let returnCard = null;
    if (this.state.selectedItem || this.state.onTapItem) {
      let beer = null;
      beer = this.state.onTapItem;
      beer = this.state.selectedItem ? this.state.selectedItem.value.beer : beer;
      const brewery = this.state.onTapItem ? beer : this.state.selectedItem.value.brewery;
      const url = this.state.onTapItem ?
        this.state.onTapItem.brewery_url : this.state.selectedItem.value.brewery.contact.url;
      const label = beer.beer_label.includes('badge-beer-default.png') ? brewery.brewery_label : beer.beer_label;

      returnCard = (
        <div>
          <img src={label} className={`card-img-top ${styles.marginBottom20}`} alt='' />
          <h4 className='card-title'>{beer.beer_name || 'No Name'}</h4>
          <p className='card-text'>{beer.beer_style}</p>
          <p className='card-text'>{`ABV: ${beer.beer_abv}% | IBU: ${beer.beer_ibu}`}</p>
          <a target='_tab' href={url}>
            <p className='card-text'>{brewery.brewery_name}</p>
          </a>
          { this.state.selectedItem &&
            <div className={styles.saveButtons}>
            {!this.state.duplicate ?
              <h4>Is this the correct Beer?</h4>
              :
              <h4 className={styles.duplicateMsg}>
                Beer is already in the wish list. Please select another beer.
              </h4>
            }
              {!this.state.duplicate &&
                <button className={`btn ${styles.save}`} onClick={this.saveModalData} ><i className='fa fa-check' aria-hidden='true' /></button>
              }
              <button className={`btn ${styles.delete}`} onClick={this.remove} ><i className='fa fa-times' aria-hidden='true' /></button>
            </div>
          }
        </div>
     );
    }
    return returnCard;
  },

  renderSelect() {
    let select = null;
    if (!this.state.selectedItem) {
      select = (
        <div className=''>
        { !this.state.onTapItem &&
          <Dropdown
            customInputClass={styles.searchInput}
            inputId='beerInput'
            isOpen={this.state.listIsOpen}
            isSearchable={true}
            alwaysSearch={true}
            itemsList={this.state.beerList}
            onChange={this.onChange}
            onHandleClose={this.onHandleClose}
            onHandleOpen={this.onHandleOpen}
            onInputKeyUp={this.onInputKeyUp}
            placeholder='Add a beer...'
            searchTerm={this.state.searchTerm}
            selectItem={this.selectItem}
            selectedIndex={this.state.selectedIndex}
            selectedItem={this.state.selectedItem}
            updateSelectedIndex={this.updateSelectedIndex}
          />
        }
        </div>
      );
    }
    return select;
  },

  renderPasswordField() {
    let ret = null;
    if (this.state.isAdminProtected) {
      ret = (
        <div className={styles.center}>
          <label htmlFor='password' className={styles.width}>Password:</label>
          <Input inputId='password' placeholder='Enter password' value={this.state.password} onChange={this.passwordChange} />
        </div>
      );
    }
    return ret;
  },

  renderBeerWishList() {
    return this.state.beerWishList.map((beer, idx) => {
      const user = this.state.user;
      const votedNo = user ? beer.votes.no.includes(this.state.user.googleId) : false;
      const votedYes = user ? beer.votes.yes.includes(this.state.user.googleId) : false;
      const noBtn = votedNo ? `${styles.round} ${styles.voted} btn btn-danger` : `${styles.round} btn btn-danger`;
      const yesBtn = votedYes ? `${styles.round} ${styles.voted} btn btn-success` : `${styles.round} btn btn-success`;
      const label = beer.beer_label.includes('badge-beer-default.png') ? beer.brewery_label : beer.beer_label;


      return (
        <div key={`${beer.bid}-${idx}`} className={`${styles.tap} card row`}>
          <h3 className={styles.header}>{`Votes: ${beer.votes.total}`}</h3>
          {this.props.user &&
            <div className={`${styles.voteButtons}`}>
              <div>
                <button className={noBtn} onClick={() => { this.vote(beer, 'no', idx); }} disabled={votedNo}><i className='fa fa-thumbs-down' aria-hidden='true' /></button>
                <p className={styles.width}>{this.calcVotePercent(beer.votes, 'no')}</p>
              </div>
            </div>
          }
          <div className='card-block'>
            <img src={label} className={`card-img-top ${styles.marginBottom20} ${styles.breweryLabel}`} alt='' />
            <h4 className='card-title'>{beer.beer_name || 'No Name'}</h4>
            <p className='card-text'>{beer.beer_style}</p>
            <p className='card-text'>{`ABV: ${beer.beer_abv}% | IBU: ${beer.beer_ibu}`}</p>
            <a target='_tab' href={beer.url}>
              <p className='card-text'>{beer.brewery_name}</p>
            </a>
            {user &&
              <button className={`btn ${styles.delete}`} onClick={() => { this.deleteModalData(beer, idx); }} ><i className='fa fa-times' aria-hidden='true' /></button>
            }
          </div>
          {this.props.user &&
            <div className={`${styles.voteButtons}`}>
              <div>
                <button className={yesBtn} onClick={() => { this.vote(beer, 'yes', idx); }} disabled={votedYes}><i className='fa fa-thumbs-up' aria-hidden='true' /></button>
                <p className={styles.width}>{this.calcVotePercent(beer.votes, 'yes')}</p>
              </div>

            </div>
          }
        </div>
      );
    });
  },

  render() {
    const user = this.state.user;
    return (
      <div className={`${styles.wishList}`}>
        <ConfirmModal
          displayModal={this.state.modalIsOpen}
          hasError={this.state.error}
          disableButton={!this.state.password && this.state.isAdminProtected}
          hideConfirmModal={this.closeModal}
          modalData={this.state.modalData}
          children={this.renderPasswordField()}
        />
        <h2>Beer Wish List</h2>
        {user &&
          <div className={`${styles.tap} ${styles.noTap} row card card-block`}>
            {this.renderSelect()}
            <div className=''>
              {this.renderBeer()}
            </div>
          </div>
        }
        {this.renderBeerWishList()}
      </div>
    );
  },
});

export default BeerWishList;
