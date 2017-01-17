import React, { PropTypes } from 'react';
import styles from './Icon.scss';

/*eslint-disable */
// To-do: Figure out a way to optimize this
import arrowDown from './icons/arrowDown.svg';
import arrowUp from './icons/arrowUp.svg';
import arrowsV from './icons/arrowsV.svg';
import bars from './icons/bars.svg';
import caretDown from './icons/caretDown.svg';
import caretUp from './icons/caretUp.svg';
import check from './icons/check.svg';
import close from './icons/close.svg';
import info from './icons/info.svg';
import pause from './icons/pause.svg';
import pencil from './icons/pencil.svg';
import play from './icons/play.svg';
import plus from './icons/plus.svg';
import search from './icons/search.svg';
import thumbsUp from './icons/thumbsUp.svg';
import warning from './icons/warning.svg';
/*eslint-enable */

// export to use in other places
export const icons = [
  'arrowDown', 'arrowUp', 'arrowsV', 'bars', 'caretDown', 'caretUp', 'check',
  'close', 'info', 'pause', 'pencil', 'play', 'plus', 'search',
  'thumbsUp', 'warning',
];

const propTypes = {
  icon: PropTypes.oneOf(icons).isRequired,
  customClass: PropTypes.string,
  title: PropTypes.string,
  presentational: PropTypes.bool,
  role: PropTypes.string,
  featureDetection: PropTypes.object,
  png: PropTypes.bool,
};

const defaultProps = {
  customClass: '',
  title: '',
  presentational: false,
};

const Icon = (props) => {
  const {
    icon, presentational, title,
    role, customClass, png,
  } = props;

  // you now have access to featureDetection in here
  const classes = `${styles.icon} ${customClass}`;
  const svgTitle = title ? <title>{title}</title> : null;
  const attrs = {};

  if (presentational === true) attrs['aria-hidden'] = 'true';
  if (role) attrs.role = role;

  let renderedIcon = null;

  if (png === true) {
    renderedIcon = <img src={`/images/icons/png/${icon}.png`} className={classes} alt={title} />;
  } else {
    renderedIcon = (
      <svg className={classes} {...attrs}>
        {svgTitle}
        <use xlinkHref={`#${icon}`} />
      </svg>
    );
  }

  return renderedIcon;
};

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;

export default Icon;
