import React, { PropTypes, PureComponent } from 'react';
import uuid from 'node-uuid';
import classNames from 'classnames';
import styles from './Dropdown.scss';
import DropdownButton from './DropdownButton';
import { upperBoundCheck, lowerBoundCheck } from '../../../lib/arrays';
import Input from '../Input';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onHandleOpen: PropTypes.func.isRequired,
  onHandleClose: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  itemsList: PropTypes.array,
  placeholder: PropTypes.string,
  selectedItem: PropTypes.object,
  selectItem: PropTypes.func,
  searchTerm: PropTypes.string,
  selectedIndex: PropTypes.number,
  onInputKeyUp: PropTypes.func,
  isSearchable: PropTypes.bool,
  label: PropTypes.string,
  fieldGroup: PropTypes.string,
  updateSelectedIndex: PropTypes.func,
  timerId: PropTypes.number,
  customClass: PropTypes.string,
  customBtnClass: PropTypes.string,
  customInputClass: PropTypes.string,
  customItemClass: PropTypes.string,
  alwaysSearch: PropTypes.bool,
};

const defaultProps = {
  placeholder: 'Please Select',
  itemsList: [],
  searchTerm: '',
  customClass: '',
  customBtnClass: '',
  customInputClass: '',
  customItemClass: '',
  selectedIndex: 0,
  isSearchable: false,
  isOpen: false,
  timerId: 0,
  alwaysSearch: false,
};

class Dropdown extends PureComponent {

  componentWillMount() {
    this._refs = {};
    this._inputId = uuid.v4();
  }

  componentDidMount() {
    window.addEventListener('keydown', this._listenForKey.bind(this), true);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this._listenForKey.bind(this), true);
    this._refs = {};
  }

  _listenForKey(event) {
    const itemsList = this.props.itemsList;
    if (this.props.isOpen && itemsList.length) {
      switch (event.key) {
        case 'ArrowUp': {
          this.props.updateSelectedIndex(lowerBoundCheck(this.props.selectedIndex - 1));
          this._verifyVisibility();
          break;
        }
        case 'ArrowDown': {
          this.props.updateSelectedIndex(upperBoundCheck(this.props.selectedIndex + 1, itemsList));
          this._verifyVisibility();
          break;
        }
        case 'Enter': {
          event.stopPropagation();
          event.preventDefault();
          this.props.selectItem(itemsList[this.props.selectedIndex]);
          break;
        }
        default:
          break;
      }
    }
  }

  _verifyVisibility() {
    const item = this._refs[`item_${this.props.selectedIndex}`];
    const container = this._refs['dropdown'];

    if (container && item) {
      const posY = item.offsetTop + item.clientHeight - container.scrollTop;
      const height = container.offsetHeight;

      if (posY > height) {
        container.scrollTop += posY - height;
      } else if (posY < item.clientHeight) {
        container.scrollTop -= item.clientHeight - posY;
      }
    }
  }

  _backdrop() {
    return (
      <div
        className={`${styles.backdrop}`}
        onClick={this.props.onHandleClose}
      />
    );
  }

  _items() {
    const {
      itemsList, selectItem, selectedIndex, updateSelectedIndex, customItemClass,
    } = this.props;

    const items = itemsList.map((item, idx) => {
      const classes = classNames({
        [styles.item]: true,
        [customItemClass]: true,
        [styles.isSelected]: item.remove,
        [styles.highlight]: idx === selectedIndex,
      });

      return (
        <li
          ref={(r) => {
            this._refs[`item_${idx}`] = r;
          }}
          value={item.value}
          key={`${item.value}-${item.text}-${idx}`}
          onMouseDown={() => { selectItem(itemsList[selectedIndex]); }}
          onMouseOver={() => { updateSelectedIndex(idx); }}
          className={classes}
        >
          {item.text}
        </li>
      );
    });

    return (
      <ul
        ref={(r) => {
          this._refs['dropdown'] = r;
        }}
        style={{ maxHeight: '200px' }}
        className={styles.items}
      >
        {items}
      </ul>
    );
  }

  _children() {
    if (this.props.children) {
      return (
        <div
          ref={(r) => {
            this._refs['dropdown'] = r;
          }}
          style={{ maxHeight: '200px', padding: '10px' }}
          className={styles.items}
        >
          {this.props.children}
        </div>
      );
    }
    return null;
  }

  _button() {
    const {
      placeholder, isOpen, onHandleOpen, onHandleClose, fieldGroup,
      isSearchable, label, customBtnClass, alwaysSearch,
    } = this.props;

    const handleClick = () => {
      if (!isOpen) {
        onHandleOpen();
      } else if (isOpen) {
        onHandleClose();
      }

      // bring focus to the Input
      if (isSearchable && this._inputId) {
        setTimeout(() => {
          document.getElementById(this._inputId).focus();
        }, 100);
      }
    };

    return (
      <DropdownButton
        isOpen={isOpen}
        label={label}
        show={!alwaysSearch && (!isSearchable || !isOpen)}
        btnText={`${placeholder}`}
        onHandleClick={handleClick}
        fieldGroup={fieldGroup}
        customBtnClass={`${styles.button} ${customBtnClass}`}
      />
    );
  }

  _search() {
    const {
      placeholder, isOpen, onChange, fieldGroup, searchTerm, isSearchable, customInputClass, timerId, alwaysSearch,
    } = this.props;
    let searchField = null;
    if (isSearchable && (isOpen || alwaysSearch)) {
      const changeHandler = (value) => { onChange(value, timerId); };
      searchField = (
        <Input
          placeholder={placeholder}
          onChange={changeHandler}
          value={searchTerm}
          inputId={this._inputId}
          fieldGroup={fieldGroup}
          customClass={`${styles.input} ${customInputClass}`}
        />
      );
    }

    return searchField;
  }

  _dropdown() {
    const { isOpen, itemsList, alwaysSearch } = this.props;
    let dropDown = null;
    let list = null;
    if (isOpen || alwaysSearch) {
      // Determine which to use, items or children
      if (itemsList.length) {
        list = this._items();
      } else if (this.props.children) {
        list = this._children();
      }
      // Iff we have a list to show, otherwise do not
      if (list) {
        dropDown = (
          <div>
            {list}
            {this._backdrop()}
          </div>
        );
      }
    }

    return dropDown;
  }

  render() {
    return (
      <div className={`${styles.dropdown} ${this.props.customClass}`} data-open={this.props.isOpen}>
        {this._button()}
        {this._search()}
        {this._dropdown()}
      </div>
    );
  }
}

Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;

export default Dropdown;
