import React, { PropTypes } from 'react';
import styles from './Input.scss';
import utilityStyles from '../../../styles/Utility.scss';

const propTypes = {
  show: PropTypes.bool,
  placeholder: PropTypes.string,
  inputId: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  fieldGroup: PropTypes.string,
  customClass: PropTypes.string,
  value: PropTypes.string,
};

const defaultProps = {
  placeholder: 'Search',
  show: true,
  fieldGroup: '',
  customClass: '',
  value: '',
};

const Input = (props) => {
  const {
    placeholder, show, inputId, fieldGroup, customClass, value, onChange,
  } = props;

  // if the input is hidden, make sure the element is not in focus (floating cursor IE issue)
  if (!show) {
    const element = document.getElementById(inputId);
    if (element) element.blur();
  }

  return (
    <input
      type='text'
      placeholder={placeholder}
      id={inputId}
      className={`${styles.input} ${customClass} ${fieldGroup ? styles[fieldGroup] : ''} ${!show ? utilityStyles.isHidden : ''}`}
      tabIndex='-1'
      value={value}
      autoComplete='false'
      onChange={(e) => { onChange(e.target.value); }}
    />
  );
};

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;

export default Input;
