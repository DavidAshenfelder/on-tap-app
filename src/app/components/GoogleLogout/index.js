import React, { PropTypes } from 'react';
import styles from './GoogleLogout.scss';

const GoogleLogout = React.createClass({
  render() {
    return (
      <button className={styles.logout} onClick={this.props.onClick}><i className='fa fa-google' aria-hidden='true' /> Logout </button>
    );
  },
});

export default GoogleLogout;
