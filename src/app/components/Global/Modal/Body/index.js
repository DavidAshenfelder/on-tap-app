import React, { PropTypes } from 'react';
import styles from './Body.scss';

const Body = ({ children }) => (
  <div className={styles.body}>
    {children}
  </div>
);

Body.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default Body;
