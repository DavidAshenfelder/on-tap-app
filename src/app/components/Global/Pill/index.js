import React, { PropTypes } from 'react';
import styles from './Pill.scss';

const statuses = [
  'attention', 'danger', 'dark', 'default', 'info',
  'primary', 'removable', 'success', 'warning',
];

const propTypes = {
  value: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  status: PropTypes.oneOf(statuses),
  removeHandler: PropTypes.func,
  name: PropTypes.string,
  rightValue: PropTypes.string,
  customClass: PropTypes.string,
};

const defaultProps = {
  status: 'default',
  name: '',
  rightValue: '',
  customClass: '',
};

const renderName = (name) => {
  return name ? `${name}: ` : null;
};

const renderLeft = (value, removeHandler, name, rightValue) => {
  let leftClasses = `${styles.left}`;

  if (rightValue || removeHandler) leftClasses = `${leftClasses} ${styles.split}`;

  return <span className={leftClasses}>{renderName(name)}{value}</span>;
};

const renderRemove = (removeHandler) => {
  let returnRemove = null;

  if (removeHandler) {
    returnRemove = (
      <span
        className={styles.remove}
        onClick={removeHandler}
      >
        &times;
      </span>
    );
  }

  return returnRemove;
};

const renderRightValue = (rightValue) => {
  let returnRightValue = null;

  if (rightValue) {
    returnRightValue = <span className={styles.rightValue}>{rightValue}</span>;
  }

  return returnRightValue;
};

const renderRight = (rightValue, removeHandler) => {
  let returnRight = false;

  if (rightValue || removeHandler) {
    let rightClasses = `${styles.right}`;

    if (rightValue) rightClasses = `${rightClasses} ${styles.split}`;

    returnRight = (
      <span className={rightClasses}>
        {renderRightValue(rightValue)}
        {renderRemove(removeHandler)}
      </span>
    );
  }

  return returnRight;
};

const Pill = ({ value, status, name, rightValue, removeHandler, customClass }) => {
  const style = customClass ? `${styles[status]} ${customClass}` : styles[status];
  return (
    <span className={style}>
      {renderLeft(value, removeHandler, name, rightValue)}
      {renderRight(rightValue, removeHandler)}
    </span>
  );
};

Pill.propTypes = propTypes;
Pill.defaultProps = defaultProps;

export default Pill;
