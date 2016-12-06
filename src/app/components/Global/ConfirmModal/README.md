## Confirm Modal

Modal component to handle confirmation of an action.

### example:

##### example data structure:
```
confirmModalData: {
  displayModal: false,
  hasError: {
    error: false,
    errorMsg: '',
  },
  modalData: {
    actionHandler: () => console.error('No click handler provided'),
    bodyText: '',
    buttonColor: 'primary',
    buttonText: '',
    headerText: '',
  },
}
```

##### example action method:
```
const showConfirmDeleteRuleModal = (rule, index, deleteRuleHandler) => {
  const modalData = {
    actionHandler: () => deleteRuleHandler(rule.id, index),
    bodyText: `Are you sure you want to delete Rule#${index + 1}: ${rule.name}`,
    buttonColor: 'danger',
    buttonText: 'Delete',
    headerText: 'Delete',
  };
  return { type: GLOBAL.CONFIRM_MODAL.OPEN, modalData };
};
```

##### example view method:
```
<button type='button' className={styles.button} onClick={() => { showConfirmDeleteRuleModal(rule, index, deleteRule); }}>
  <Icon icon='close' />
</button>
```


### Props:
| Name            | Required  | Default   | Type                      | Description                           |
| ----------------| :--------:| :--------:| ------------------------- | ------------------------------------- |
| displayModal    | Yes       | 'false'   | boolean                   | A boolean to determine to show or hide the modal. |
| hasError        | Yes       | {error: false, errorMsg: ''}   | object                   | An object with boolean to determine to show or hide an error and an errorMsg.  |
| hideConfirmModal | Yes       | ''        | function                 | A function that handles the action call to close the modal. (This function does not have to be passed in. it is built into the confirm modal.)|
| modalData                 | Yes       | {}        | object                    | {actionHandler, headerText, bodyText, buttonText, buttonColor} (actionHandler is the only required modalData attribute.)|
| modalData.actionHandler   | Yes       | ''        | function                  | A function that will be passed to the button to handle the desired action of the confirm modal.|
| modalData.headerText      | No        | 'Confirm' | string                    | Text to display in the header portion of the modal.|
| modalData.bodyText        | No        | 'Are you sure?' | string              | Text to display in the body portion of the modal.|
| modalData.buttonText      | No        | 'Confirm' | string                    | Text to display in the button of modal.|
| modalData.buttonColor     | No        | 'primary' | oneOf (string)            | Color of the button you would like ['default', 'primary', 'silent', 'danger'].|
