import React, { PropTypes } from 'react';
import styles from './Modal.scss';

const propTypes = {
  displayModal: PropTypes.bool,
  children: PropTypes.array,
  customClass: PropTypes.string,
};

const defaultProps = {
  displayModal: false,
  customClass: '',
};

const Modal = ({ displayModal, children, customClass }) => (
  <div className={`${styles.wrapper} ${!displayModal ? styles.wrapperHidden : ''} ${customClass}`}>
    <div className={styles.backdrop} />
    <div className={styles.modal} role='dialog' tabIndex='-1'>
      <div className={styles.dialog} role='document'>
        {children}
      </div>
    </div>
  </div>
);

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
