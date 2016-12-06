import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './Loader.scss';

const propTypes = {
  customClass: PropTypes.string,
  desaturated: PropTypes.bool,
  small: PropTypes.bool,
  center: PropTypes.bool,
};

const Loader = (props) => {
  // possible classes are keys, bool props are values.
  const classStringLoader = classNames({
    [styles.center]: props.center,
    [props.customClass]: !!props.customClass,
  });

  const classStringPulse = classNames({
    [styles.sm]: props.small,
    [styles.desaturated]: props.desaturated,
  });

  return (
    <div className={`${styles.loader} ${classStringLoader}`}>
      <span className={`${styles.pulse} ${classStringPulse}`} />
      <span className={`${styles.pulse} ${classStringPulse}`} />
      <span className={`${styles.pulse} ${classStringPulse}`} />
    </div>
  );
};

Loader.propTypes = propTypes;

export default Loader;
