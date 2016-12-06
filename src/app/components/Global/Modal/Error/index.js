import React, { PropTypes } from 'react';
import styles from './Error.scss';
import { defaultErrMsg } from '../../../../lib/general';

const propTypes = {
  hasError: PropTypes.object.isRequired,
};

const defaultProps = {
  hasError: {
    error: false,
    errorMsg: '',
  },
};

const Error = ({ hasError }) => {
  return (
    <div className={`${styles.error} ${!hasError.error ? styles.errorHidden : ''}`} role='alert'>
    {/* If you get the defaultErrMsg then there was not an error message passed through with the hasError.errorMsg*/}
      {hasError.errorMsg || defaultErrMsg}
    </div>
  );
};

Error.propTypes = propTypes;
Error.defaultProps = defaultProps;

export default Error;
