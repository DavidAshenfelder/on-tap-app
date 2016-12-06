import React, { PropTypes } from 'react';
import Button from '../../Button';
import Icon, { icons } from '../../../../components/Global/Icon';
import styles from '../Notifications.scss';

const propTypes = {
  type: PropTypes.oneOf(['success', 'danger', 'info', 'warning']),
  message: PropTypes.string.isRequired,
  icon: PropTypes.oneOf(icons),

  closable: PropTypes.bool,
  timeoutId: PropTypes.number,
  persist: PropTypes.bool,
  html: PropTypes.bool,

  handleClickClose: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
};

const defaultProps = {
  icon: 'check',
  closable: true,
  type: 'info',
  html: false,
  persist: false,
};

function createMarkup(markup) { return { __html: markup }; }

const Notification = (props) => {
  const {
    type, message, icon, closable, html,
    handleClickClose, onMouseEnter, onMouseLeave,
  } = props;

  let close;

  if (closable) {
    close = (
      <Button
        icon='close'
        title='Close notification'
        color='silent'
        customClass={styles.close}
        onClickHandler={() => handleClickClose()}
      />
    );
  }

  let innervalue;
  if (html) {
    innervalue = (
      <p className={styles.message} dangerouslySetInnerHTML={createMarkup(message)} />
    );
  } else {
    innervalue = (<p className={styles.message}>{message}</p>);
  }

  return (
    <div
      role='alert'
      className={styles.notification}
      onMouseEnter={() => onMouseEnter()}
      onMouseLeave={() => onMouseLeave()}
    >
      <div className={`${styles.icon} ${styles[type]}`}>
        <Icon icon={icon} presentational />
      </div>
      {innervalue}
      {close}
    </div>
  );
};

Notification.propTypes = propTypes;
Notification.defaultProps = defaultProps;

export default Notification;
