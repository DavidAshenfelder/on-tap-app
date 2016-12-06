import React, { PropTypes } from 'react';
import Icon, { icons } from '../../../components/Global/Icon';
import styles from './Button.scss';

const sizes = ['xs', 'sm', 'md', 'wide', 'lg', 'squareSmall'];
const colors = ['default', 'primary', 'danger', 'link', 'silent'];

const propTypes = {
  text: PropTypes.string,
  icon: PropTypes.oneOfType([
    PropTypes.oneOf(icons), // used for an icon only
    PropTypes.shape({       // used for icon + text
      icon: PropTypes.oneOf(icons),
      align: PropTypes.oneOf(['left', 'right']),
    }),
  ]),
  presentational: PropTypes.bool,
  title: PropTypes.string,
  size: PropTypes.oneOf(sizes),
  color: PropTypes.oneOf(colors),
  disabled: PropTypes.bool,
  customClass: PropTypes.string,
  onClickHandler: PropTypes.func.isRequired,
  fieldGroup: PropTypes.string,
  png: PropTypes.bool,
};

const defaultProps = {
  text: '',
  icon: null,
  title: '',
  size: 'md',
  color: 'default',
  disabled: false,
  customClass: '',
  fieldGroup: '',
};

const renderIcon = (text, icon, title, presentational = true, png = false) => {
  let returnIcon = null;

  if (icon) {
    let classes = `${styles[icon.align === 'right' ? 'iconRight' : 'iconLeft']}`;

    returnIcon = (
      <Icon key='icon' presentational title={title} icon={`${icon.icon}`} customClass={classes} png={png} />
    );
  }

  return returnIcon;
};

const buildClassString = (size, color, customClass, fieldGroup) => {
  let classes = `${styles.button} ${styles[size]} ${styles[color]}`;

  if (customClass) classes = `${classes} ${customClass}`;

  if (fieldGroup) classes = `${classes} ${styles[fieldGroup]}`;

  return classes;
};

const renderButton = (text, icon, title, presentational, png) => {
  const returnButton = [];

  if (text) {
    returnButton.push(text);
  }

  if (icon) {
    if (typeof icon === 'object') {
      // icon + text
      if (icon.align === 'right') {
        // button on left
        returnButton.push(renderIcon(text, icon, title, presentational, png));
      } else {
        // icon on left
        returnButton.unshift(renderIcon(text, icon, title, presentational, png));
      }
    } else {
      // icon only
      returnButton.push(<Icon key='icon' role='img' title={title} icon={`${icon}`} customClass={styles.iconCentered} png={png} />);
    }
  }

  return returnButton;
};

const Button = (props) => {
  const {
    text, icon, size, color, disabled, customClass, onClickHandler, fieldGroup, title, png,
  } = props;
  const attrs = {};

  if (!text) {
    attrs['aria-label'] = title;
  }

  return (
    <button
      type='button'
      className={buildClassString(size, color, customClass, fieldGroup)}
      disabled={disabled}
      onClick={(e) => onClickHandler(e)}
      role='button'
      {...attrs}
    >
      {renderButton(text, icon, title, false, png)}
    </button>
  );
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
