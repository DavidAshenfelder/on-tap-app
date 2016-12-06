import React, { PropTypes } from 'react';
import Dropdown from '../Global/Dropdown';
import Service from '../../Services/Service';
import styles from './BeerSearch.scss';
import ConfirmModal from '../Global/ConfirmModal';
import Input from '../Global/Input';


const BeerSearch = React.createClass({
  propTypes: {
    position: PropTypes.number.isRequired,
    onTapItem: PropTypes.object,
    user: PropTypes.object,
  },

  getInitialState() {
    return {
      tapNumber: this.props.position,
      beerList: [],
      listIsOpen: false,
      searchTerm: '',
      selectedIndex: 0,
      selectedItem: null,
      onTapItem: this.props.onTapItem || null,
      modalIsOpen: false,
      password: '',
      error: { error: false, errorMsg: '' },
      user: this.props.user,
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
    this.setState({
      ...this.state,
      tapNumber: props.position,
      onTapItem: props.onTapItem,
      user: props.user,
    });
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
      console.log(data);
      this.setState({ ...this.state, beerList: data });
    });
  },

  selectItem() {
    this.setState({
      ...this.state,
      beerList: [],
      listIsOpen: false,
      searchTerm: '',
      selectedIndex: 0,
      selectedItem: this.state.beerList[this.state.selectedIndex],
    });
  },

  searchForBeers() {
    this.searchBeers(this.state.searchTerm);
  },

  saveTap() {
    const tap = this.state.tapNumber;
    const bid = this.state.selectedItem.value.beer.bid;
    const params = { password: this.state.password };
    Service.saveTap(tap, bid, params).then((res) => {
      if (res.status === 200) {
        this.setState(
          {
            tapNumber: this.props.position,
            beerList: [],
            listIsOpen: false,
            searchTerm: '',
            selectedIndex: 0,
            selectedItem: null,
            onTapItem: res.response.beer,
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
    this.setState({ ...this.state, selectedItem: null });
  },

  passwordChange(password) {
    this.setState({ ...this.state, password, error: { error: false, errorMsg: '' } });
  },

  openModal(modalData, isTappedModal) {
    this.setState({ ...this.state, modalIsOpen: true, modalData, isTappedModal });
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

  deleteModalData() {
    const beerName = this.state.onTapItem ? `${this.state.onTapItem.brewery_name} ${this.state.onTapItem.beer_name}` : 'this beer';
    this.openModal({
      headerText: 'Delete',
      bodyText: `Delete ${beerName} from tap ${this.state.tapNumber}?`,
      buttonText: 'Delete',
      buttonColor: 'danger',
      actionHandler: this.delete,
    });
  },

  saveModalData() {
    const value = this.state.selectedItem.value;
    const beerName = this.state.selectedItem ? `${value.brewery.brewery_name} ${value.beer.beer_name}` : 'this beer';
    this.openModal({
      headerText: 'Save',
      bodyText: `Save ${beerName} to tap ${this.state.tapNumber}?`,
      buttonText: 'Save',
      buttonColor: 'primary',
      actionHandler: this.saveTap,
    });
  },

  delete() {
    const tap = this.state.tapNumber;
    const params = { tap, password: this.state.password };
    return Service.deleteTap(tap, params).then((res) => {
      if (res.status === 200) {
        this.setState(
          {
            tapNumber: this.props.position,
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

  tappedModalData() {
    const beerName = this.state.onTapItem ? `${this.state.onTapItem.brewery_name} ${this.state.onTapItem.beer_name}` : 'this beer';
    this.openModal({
      headerText: 'Kick that Keg',
      bodyText: `Kick ${beerName} from tap ${this.state.tapNumber}?`,
      buttonText: 'Kick',
      buttonColor: 'danger',
      actionHandler: this.tapped,
    }, true);
  },

  tapped() {
    const id = this.state.onTapItem.bid;
    return Service.tapped(id).then((res) => {
      this.setState(
        {
          tapNumber: this.props.position,
          beerList: [],
          listIsOpen: false,
          searchTerm: '',
          selectedIndex: 0,
          selectedItem: null,
          onTapItem: res,
          modalIsOpen: false,
          password: '',
          error: { error: false, errorMsg: '' },
        }
      );
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
          <img src={label} className={`card-img-top ${styles.marginBottom20} ${styles.breweryLabel}`} alt='' />
          <h4 className={`${styles.beerTitle} card-title`}>{beer.beer_name || 'No Name'}</h4>
          <p className='card-text'>{beer.beer_style}</p>
          <p className='card-text'>{`ABV: ${beer.beer_abv}% | IBU: ${beer.beer_ibu}`}</p>
          <a target='_tab' href={url}>
            <p className='card-text'>{brewery.brewery_name}</p>
          </a>
        </div>
     );
    }
    return returnCard;
  },

  renderSelect() {
    let select = null;
    const isAuth = this.state.user;
    if (!this.state.selectedItem) {
      select = (
        <div className=''>
        {!this.state.onTapItem &&
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
    // If we want to have them logged in to add a beer
    // else if (!isAuth && !this.state.selectedItem && !this.state.onTapItem) {
    //   select = 'Login to add beer...';
    // }
    return select;
  },

  renderPasswordField() {
    let ret = null;
    if (!this.state.isTappedModal) {
      ret = (
        <div className={styles.center}>
          <label htmlFor='password' className={styles.width}>Password:</label>
          <Input inputId='password' placeholder='Enter password' value={this.state.password} onChange={this.passwordChange} />
        </div>
      );
    }
    return ret;
  },

  render() {
    const isAuth = this.state.user;
    const kicked = this.state.onTapItem && this.state.onTapItem.tapped;
    const headerStyle = kicked ? `${styles.header} ${styles.kickedHeader}` : `${styles.header} ${styles.onTapHeader}`;
    const cardBlockStyle = kicked ? `${styles.kickedCardBlock} ${styles.cardBlock} card-block` : `${styles.cardBlock} card-block`;
    return (
      <div className={`col-md-4 col-sm-12 col-xs-12 ${styles.marginBottom20}`}>
        <ConfirmModal
          displayModal={this.state.modalIsOpen}
          hasError={this.state.error}
          disableButton={!this.state.password && !this.state.isTappedModal}
          hideConfirmModal={this.closeModal}
          modalData={this.state.modalData}
          children={this.renderPasswordField()}
        />
        <div className={`${styles.tap} card`}>
          <div className={headerStyle}>{kicked ? 'Kicked!' : `Tap ${this.state.tapNumber}`}</div>
          <div className={cardBlockStyle}>
          {this.renderSelect()}
            {this.renderBeer()}
          </div>
          {this.state.selectedItem &&
            <div className={styles.saveButtons}>
              <h4>Is this the correct Beer?</h4>
              <button className={`btn ${styles.save}`} onClick={this.saveModalData} ><i className='fa fa-check' aria-hidden='true' /></button>
              <button className={`btn ${styles.delete}`} onClick={this.remove} ><i className='fa fa-times' aria-hidden='true' /></button>
            </div>
          }
          {(this.state.onTapItem
          && !this.state.selectedItem
          && !this.state.onTapItem.tapped) &&

            <div className={styles.saveButtons}>
              {(this.state.onTapItem && !this.state.onTapItem.tapped) &&
                <button className={`btn ${styles.tapped}`} onClick={this.tappedModalData}><i className='fa fa-exclamation-triangle fa-3' aria-hidden='true' /></button>
              }
            </div>
          }
          {(this.state.onTapItem && this.state.onTapItem.tapped) &&
            <div className={styles.saveButtons}>
              <button className={`btn ${styles.delete}`} onClick={this.deleteModalData} ><i className='fa fa-times' aria-hidden='true' /></button>
            </div>
          }
        </div>
      </div>
    );
  },
});

export default BeerSearch;
