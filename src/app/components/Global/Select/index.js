import React, { PropTypes } from 'react';
import styles from './Select.scss';

const propTypes = {
  options: PropTypes.array.isRequired,
  renderOptionData: PropTypes.func.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  selectedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  compareValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  customClass: PropTypes.string,
};

const defaultProps = {
  customClass: '',
};

const renderSelect = (options, renderOptionData) => {
  // if the list is filtered, use that. otherwise use the base set of items.
  return options.map((item, idx) => {
    return renderOptionData(item, idx);
  });
};

const Select = (props) => {
  const {
    options, renderOptionData, onChangeHandler,
    selectedValue, compareValue, customClass,
  } = props;
  return (
    <div className={styles.selectWrapper}>
      <select
        className={`${styles.select} ${customClass}`}
        onChange={
          (e) => {
            const selectedOption = options[e.target.selectedIndex];
            // the compare value is used for the range select validation.
            // if the min value > max value throw error.
            // being the second param in the onChangeHandler if it is not needed,
            // then do not pass it.
            onChangeHandler(selectedOption, compareValue);
          }}
        value={selectedValue}
      >
        {renderSelect(options, renderOptionData)}
      </select>
    </div>
  );
};

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;

export default Select;
