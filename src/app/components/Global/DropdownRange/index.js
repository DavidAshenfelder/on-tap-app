import React, { PropTypes } from 'react';
import Select from '../Select';
import styles from './DropdownRange.scss';

const propTypes = {
  values: PropTypes.array,
  translateMinimum: PropTypes.func.isRequired,
  translateMaximum: PropTypes.func.isRequired,
  renderOptionData: PropTypes.func.isRequired,
  onSelectOption: PropTypes.object.isRequired,
  selectedItems: PropTypes.object,
};

const defaultProps = {
  includeSearchInValues: true,
  allowEqualValues: true,
};

const DropdownRange = (props) => {
  const {
      renderOptionData, values, onSelectOption,
      translateMinimum, translateMaximum, selectedItems,
  } = props;

  const minItems = values.map((val) => {
    return {
      payload: val,
      text: translateMinimum(val),
    };
  });

  const maxItems = values.map((val) => {
    return {
      payload: val,
      text: translateMaximum(val),
    };
  });

  return (
    <div>
      <Select
        options={minItems}
        renderOptionData={renderOptionData}
        onChangeHandler={onSelectOption.selectMinPrice}
        selectedValue={selectedItems.selectedMin}
        compareValue={selectedItems.selectedMax}
        customClass='at-price-min-select'
      />
      <p className={styles.seperator}>to</p>
      <Select
        options={maxItems}
        renderOptionData={renderOptionData}
        onChangeHandler={onSelectOption.selectMaxPrice}
        selectedValue={selectedItems.selectedMax}
        compareValue={selectedItems.selectedMin}
        customClass='at-price-max-select'
      />
    </div>
  );
};

DropdownRange.propTypes = propTypes;
DropdownRange.defaultProps = defaultProps;

export default DropdownRange;
