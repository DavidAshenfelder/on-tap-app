# Button

Button component to handle all the clicky/push-button things!

This component supports text-only, icon-only, or icon & text with icon alignment on the left or right.

## Props:

Name           | Required |  Default  | Type                     | Description
-------------- | :------: | :-------: | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------
text           |    No    |    ''     | string                   | Text of button (`null` if icon-only button)
icon           |    No    |   null    | oneOf (string) or object | Use `string` for icon-only button.<br>
<br>
Use `object` for icon + text (example: `{ icon: 'name', align: 'left/right'}`)
size           |    No    |   'md'    | oneOf (string)           | ['xs', 'sm', 'md', 'lg']
colors         |    No    | 'default' | oneOf (string)           | ['danger', 'default', 'primary', 'silent', 'link']
disabled       |    No    |   false   | bool                     | Changes the clickability of button
customClass    |    No    |    ''     | string                   | Additional class name to use in the component<br>
<br>
**Note:** CSS Module can be passed through (example: `customClass={styles.cssModule}`)
onClickHandler |   Yes    |    N/A    | func                     | Function for event handler (example: `onClickHandler={() => doSomethingCool()}`)
fieldGroup     |    No    |    ''     | string
