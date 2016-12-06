import { PureComponent, PropTypes } from 'react';

const propTypes = {
  globalWindowEventsKeyEsc: PropTypes.func,
  globalWindowEventsKeyArrowUp: PropTypes.func,
  globalWindowEventsKeyArrowDown: PropTypes.func,
  globalWindowEventsKeyEnter: PropTypes.func,
  disableESC: PropTypes.bool,
};

class WindowEvents extends PureComponent {

  componentDidMount() {
    window.addEventListener('keydown', this._listenForKey.bind(this), true);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this._listenForKey.bind(this), true);
  }

  _listenForKey(event) {
    switch (event.key) {
      case 'Escape':
        if (!this.props.disableESC) this.props.globalWindowEventsKeyEsc(event);
        break;
      case 'ArrowUp':
      case 'ArrowDown':
      case 'Enter':
      default:
        break;
    }
  }

  render() {
    return null;
  }

}

WindowEvents.propTypes = propTypes;

export default WindowEvents;
