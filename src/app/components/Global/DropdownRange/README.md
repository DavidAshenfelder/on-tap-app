## DropdownRange

The DropdownRange component piggybacks on the Dropdown component, and gives you two select options, Max and Min.


Props accepted include the following:

(Many of these are the same for the `Dropdown`, because they are needed to be passed down to the two Dropdowns that are used in this component)

```
* Note: Some variables at this level may be an object, because it will need to carry two values one for the min, and one for the max.
```

- `values` (array) - Array used to parse out the `<li>` in the drop down.

- `range` (object) - Currently not being used, but could later be used in calculating equality of the min and max values.

- `minPlaceholder` and `maxPlaceholder` (string) - strings used as placeholder when nothing is selected.

- `rangeType` (object) - Is not currently being used in this implementation, but could be used later on in calculating equality of the min and max range.

- `allowEqualValues` (bool): currently not being used, but may implement more as we go. Would be used to allow equal values in the min and max range.

- `inputId` (string) - the html id attribute value for the input

- `renderListItemData` (func) - Function passed down to Dropdown to render items.

- `onSelectItem` (object) - object with two functions, `selectMinValue` and `selectedValue` to handle the respective Dropdown `onSelectItem` function.

- `isOpen` (object) - Object with `minIsOpen` and `maxIsOpen` to open and close the correct Dropdown.

- `onHandleOpen` (object) - Object with `Min` and `Max` to handle the respective `onHandleOpen`.

- `onHandleClose` (object) -Object with `Min` and `Max` to handle the respective `onHandleClose`.

- `selectedItem` (object) - object with `selectedMinValue` and `selectedMaxValue` to be parsed to the Dropdown.

- `label` (object) - object with two sting values `minLabel` and `maxLabel`
