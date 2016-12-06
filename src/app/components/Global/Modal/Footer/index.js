import React from 'react';
import styles from './Footer.scss';

const Footer = ({ children }) => (
  <div className={styles.footer}>
    {children}
  </div>
);

export default Footer;
