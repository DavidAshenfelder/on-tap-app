import React, { PropTypes } from 'react';
import Notification from './Notification';
import styles from './Notifications.scss';

const propTypes = {
  notifications: PropTypes.array,

  displayBackdrop: PropTypes.bool,

  closeNotification: PropTypes.func.isRequired,

  notificationMouseEnter: PropTypes.func.isRequired,
  notificationMouseLeave: PropTypes.func.isRequired,
};

const defaultProps = {
  notifications: [],
  displayBackdrop: false,
};

const NotificationCont = (props) => {
  const notifications = props.notifications.map(n => (
    <Notification
      key={n.id}
      id={n.id}
      type={n.type}
      icon={n.icon}
      message={n.message}

      closable={n.closable}
      persist={n.persist}
      timeoutId={n.timeoutId}
      html={n.html}

      handleClickClose={() => props.closeNotification(n)}

      onMouseEnter={() => props.notificationMouseEnter(n)}
      onMouseLeave={() => props.notificationMouseLeave(n)}
    />
  ));

  if (props.displayBackdrop) {
    return (
      <div>
        <div className={props.displayBackdrop ? styles.backdrop : ''} />
        <div className={styles.wrapper}>
          {notifications}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {notifications}
    </div>
  );
};

NotificationCont.propTypes = propTypes;
NotificationCont.defaultProps = defaultProps;

export default NotificationCont;
