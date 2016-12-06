import React, { PureComponent, PropTypes } from 'react';

const propTypes = {
  noScroll: PropTypes.bool.isRequired,
};

const defaultProps = {
  noScroll: false,
};

class WindowActions extends PureComponent {

  componentWillReceiveProps(newProps) {
    if (this.props.noScroll !== newProps.noScroll) {
      if (newProps.noScroll) {
        document.getElementsByTagName('body')[0].classList.add('no-scroll');
      } else {
        document.getElementsByTagName('body')[0].classList.remove('no-scroll');
      }
    }
  }

  render() {
    return null;
  }

}

WindowActions.propTypes = propTypes;
WindowActions.defaultProps = defaultProps;

export default WindowActions;
