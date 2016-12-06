import React, { PropTypes } from 'react';
import styles from './ConfirmModal.scss';
import Modal from '../Modal';
import Header from '../Modal/Header';
import Body from '../Modal/Body';
import Footer from '../Modal/Footer';
import Error from '../Modal/Error';
import Button from '../Button';

const propTypes = {
  displayModal: PropTypes.bool.isRequired,
  hasError: PropTypes.object.isRequired,
  hideConfirmModal: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]
  ),
  modalData: PropTypes.shape({
    actionHandler: PropTypes.func.isRequired,
    headerText: PropTypes.string,
    bodyText: PropTypes.string,
    buttonText: PropTypes.string,
    buttonColor: PropTypes.string,
  }).isRequired,
};

const defaultProps = {
  modalData: {
    headerText: 'Confirm',
    bodyText: 'Are you sure?',
    buttonColor: 'primary',
    buttonText: 'Confirm',
  },
};

const setModalDataDefaults = (modalData) => {
  const defaultData = defaultProps.modalData;
  return {
    bodyText: modalData.bodyText || defaultData.bodyText,
    headerText: modalData.headerText || defaultData.headerText,
    buttonColor: modalData.buttonColor || defaultData.buttonColor,
    buttonText: modalData.buttonText || defaultData.buttonText,
  };
};

const ConfirmModal = (props) => {
  const { displayModal, modalData, hideConfirmModal, hasError, children, disableButton } = props;
  const newModalData = setModalDataDefaults(modalData);
  return (
    <Modal displayModal={displayModal} customClass='at-confirm-modal'>
      <Header
        customClass='padded'
        headerText={newModalData.headerText}
        closeHandler={hideConfirmModal}
      />
      <Error hasError={hasError} />
      <Body>
        <p className={styles.body}>{newModalData.bodyText}</p>
        {children}
      </Body>
      <Footer>
        <Button
          color='default'
          text='Cancel'
          customClass='at-close-btn'
          onClickHandler={hideConfirmModal}
        />
        <Button
          disabled={hasError.error || disableButton}
          color={newModalData.buttonColor}
          customClass='at-action-btn'
          text={newModalData.buttonText}
          onClickHandler={modalData.actionHandler}
        />
      </Footer>
    </Modal>
  );
};

ConfirmModal.propTypes = propTypes;
ConfirmModal.defaultProps = defaultProps;

export default ConfirmModal;
