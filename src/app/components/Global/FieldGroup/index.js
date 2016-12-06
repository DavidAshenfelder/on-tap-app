import React, { PropTypes } from 'react';
import styles from './FieldGroup.scss';

const propTypes = {
  children: PropTypes.array,
};

const addFieldGroupProps = (children) => {
  return React.Children.map(children, (child, idx) => {
    let updatedProp = {};
    if (idx === 0) {
      updatedProp = {
        fieldGroup: 'left',
      };
    } else if (idx === children.length - 1) {
      updatedProp = {
        fieldGroup: 'right',
      };
    } else {
      updatedProp = {
        fieldGroup: 'middle',
      };
    }

    return React.cloneElement(child, updatedProp);
  });
};

const FieldGroup = ({ children }) => {
  return (
    <div className={styles.fieldGroup}>
      {addFieldGroupProps(children)}
    </div>
  );
};

FieldGroup.propTypes = propTypes;

export default FieldGroup;
