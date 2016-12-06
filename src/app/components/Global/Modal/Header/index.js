import React, { PropTypes } from 'react';
import Button from '../../Button';
import styles from './Header.scss';

const propTypes = {
  customClass: PropTypes.string,
  children: PropTypes.array,
  headerText: PropTypes.string,
  closeHandler: PropTypes.func.isRequired,
};

const defaultProps = {
  customClass: null,
};

const Header = ({ children, customClass, headerText, closeHandler }) => {
  const heading = headerText ? <h1 className={styles.heading}>{headerText}</h1> : null;

  return (
    <header className={`${styles.header} ${styles[customClass] || ''}`}>
      {heading}
      {children}
      <Button
        color='silent'
        customClass={`${styles.close} at-close`}
        icon='close'
        title='Close modal'
        onClickHandler={closeHandler}
      />
    </header>
  );
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
