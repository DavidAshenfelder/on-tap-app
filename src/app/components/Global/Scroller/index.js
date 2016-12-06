import React, { PropTypes } from 'react';
import styles from './Scroller.scss';

const propTypes = {
  maxHeight: PropTypes.string,
  dropdown: PropTypes.bool,
  customClass: PropTypes.string,
};

const defaultProps = {
  maxHeight: '50vh',
  dropdown: false,
  customClass: '',
};

const Scroller = ({ maxHeight, children, dropdown, customClass }) => {
  const className = customClass ? `${styles.scroller} ${customClass}` : `${styles.scroller}`;

  let retHtml = (
    <div
      style={{ maxHeight }}
      className={className}
    >
      {children}
    </div>
  );

  if (dropdown) {
    retHtml = (
      <ul
        style={{ maxHeight }}
        className={className}
      >
       {children}
      </ul>
    );
  }

  return retHtml;
};

Scroller.propTypes = propTypes;
Scroller.defaultProps = defaultProps;

export default Scroller;
