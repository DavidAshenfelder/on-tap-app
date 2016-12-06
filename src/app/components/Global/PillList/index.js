import React, { PropTypes } from 'react';
import Pill from '../Pill';
import styles from './PillList.scss';

const propTypes = {
  filterArr: PropTypes.array.isRequired,
  removeHandler: PropTypes.func,
  status: PropTypes.string,
  customClass: PropTypes.string,
};

const defaultProps = {
  status: 'default',
  customClass: '',
};

const renderFilterPills = (filterArr, removeHandler, status) => {
  return filterArr.map((a, i) => (
    <li
      key={i}
      className={`${styles.pill} at-pill`}
    >
      <Pill
        {...a}
        // with this, we only support removeHandler passed into entire PillList, not individual handlers.
        removeHandler={removeHandler ? () => removeHandler(i, a) : null}
        // individual pill status needs ot overwrite status passed to entire list
        status={a.status || status}
      />
    </li>
  ));
};

const PillList = ({ filterArr, removeHandler, status, customClass }) => (
  <ul className={`${styles.pills} ${customClass}`}>
    {renderFilterPills(filterArr, removeHandler, status)}
  </ul>
);

PillList.propTypes = propTypes;
PillList.defaultProps = defaultProps;

export default PillList;
