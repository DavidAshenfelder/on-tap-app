## Pill

The pill is all-in-one component which consolidated Boomstrap&rsquo;s marker, label, and pill.

### Props:
| Name            | Required | Default  | Type    | Description                     |
| ----------------| :-------:| :-------:| --------| ------------------------------- |
| value           | Yes      | N/A      | string  | Used for just a standard pill   |
| status          | No       | default  | string  | Changes color of pill<br><br>**Statuses:** 'attention', 'danger', 'dark', 'default', 'info', 'primary', 'removable', 'success', 'warning' |
| removable       | No       | false    | bool    | Conditionally adds a remove icon (&times;) |  
| name            | No       | ''       | string  | Will prepend string to the `value` (example: **City:** ) |
| rightValue      | No       | ''       | string  | Turns pill to a split (2 color) |
| customClass     | No       | ''       | string  | adds custom class to styles |
