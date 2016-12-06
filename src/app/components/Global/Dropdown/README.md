## Dropdown

### Changes
----------------------
`Dropdown` component now takes a uniform set of options that can work with all of the components in Rule Modal

- _LocationSearch_ - Was AutoComplete (since removed) and now takes option `alwaysSearch` which always displays the search input.  Also, integrated with `timerId` for search flow as the data is requested upon each search (unlike Agent and Source search)
- _PriceSelect_ - For instances such as this, where the `Dropdown` is actually just a container for another component with its own environment, all you need to do is provide the handlers to toggle the drop down open/closed, and then put your component as a `child` of the Dropdown.
- _TypeSelect_ - No search, just dropdown with ArrowUp/Down/Mouse events
- _SourceSearch_, _AgentSearch_ - Button, with search (when opened) and data already passed in.

*More Deets*
- `Dropdown` takes `customBtnClass`, `customInputClass` and `customItemClass`.  Each is passed to the proper sub components.


### Further revision of below README will happen ASAP.
------------------------

The Dropdown component is a customized bootstrap button dropdown with a typeahead search input, a port and revamp of the Dropdown component in boomstrap-react.

There are 3 main components:

1. DropdownButton (sub component)
2. DropdownInput (sub component)
3. Menu with Backdrop.

Props accepted include the following:

- `isOpen` (bool) - a true/false value that will open the Menu, hide the Button, and show the Input if true.

- `onHandleOpen` (func) - a function that will fire when the Button is clicked.  Typically used to toggle isOpen to true, at the minimum

- `onHandleClose` (func) - a function that will fire when the menu backdrop is clicked.  Typically used to toggle isOpen to false, at the minimum.

- `listItemData` (array) - an array of the items that will be rendered in the menu. This data can be formatted however you like, because the `renderListItemData` function will be passed in and written specifically to massage this data and return exactly what you need to display.

- `renderListItemData` (func) - A function that accepts the values to render, and returns them in whatever fashion you would like. This allows you to massage and manipulate the data and return exactly what you need.
```
Example (renderListItemData) Function:
  const renderPriceData = (item, idx, executeSelectItem, onSelectItem) => {
    return (
      <li
        key={`${item.text}-${idx}`}
        value={item.payload}
        onClick={(e) => executeSelectItem(e, item, onSelectItem)}
      >
        {item.text}
      </li>
    );
  };
```

- `filteredListItemData` (array) - a separate array of filtered data, which will override the menu render method if it exists.  Keeping track of both the original listItemData and filteredListItemData means we can quickly revert to the original if the user closes the dropdown.

- `placeholder` (string) - The placeholder text value of input, and default button value when nothing is selected.

- `selectedItem` (object) - a single object representing the item selected from the listItemData array

- `onSelectItem` (func) - a function that will be called when a menu item is clicked.

- `onInputKeyUp` (func) - a function that will be attached to the onKeyUp event of the input

- `inputId` (string) - the html id attribute value for the input

- `showButton` (bool) - a boolean to show or hide the button conditionally. Used for the range select.

- `filterInput` (bool) - a boolean to show or hide the search filter input.

- `label` (string) - string passed in for a label above the select. (if not passed in nothing will show.)
