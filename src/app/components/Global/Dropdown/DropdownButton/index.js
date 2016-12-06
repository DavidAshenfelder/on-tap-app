import React, { PropTypes } from 'react';
import Button from '../../../Global/Button';
import styles from './DropdownButton.scss';
import utilityStyles from '../../../../styles/Utility.scss';

const propTypes = {
  btnText: PropTypes.string.isRequired,
  onHandleClick: PropTypes.func.isRequired,
  show: PropTypes.bool,
  label: PropTypes.string,
  fieldGroup: PropTypes.string,
  customBtnClass: PropTypes.string,
  isOpen: PropTypes.bool,
};

const defaultProps = {
  show: true,
  customBtnClass: '',
};

const DropdownButton = (props) => {
  const {
    onHandleClick, show, btnText, label, fieldGroup, customBtnClass, isOpen,
  } = props;

  return (
    <div className={`${show ? '' : utilityStyles.isHidden}`}>
      {label &&
        <label>{label}:</label>
      }
      <Button
        text={btnText}
        icon={
          isOpen ? {
            icon: 'caretUp', align: 'right',
          } : {
            icon: 'caretDown', align: 'right',
          }
        }
        title='Show dropdown items'
        presentational
        onClickHandler={onHandleClick}
        fieldGroup={fieldGroup}
        customClass={`${styles.button} ${customBtnClass}`}
      />
    </div>
  );
};

DropdownButton.propTypes = propTypes;
DropdownButton.defaultProps = defaultProps;

export default DropdownButton;
