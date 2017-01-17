## Icon

This is an icon component in all its glory. We are using the SVG version of icons from Font Awesome. We are using [Webpack SVG sprite loader](https://github.com/kisenka/svg-sprite-loader) to create a sprite which is appended to the `<body />` element and referencing that sprite with this component.

### Usage:
```javascript
<Icon icon='iconName' customClass={styles.component} presentationl role='img' title='Descriptive text of icon appearance' />
```
#### Returns:
```html
<svg class="icon__icon___[hash] file__component__[hash]">
  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#iconName"></use>
</svg>```


### Props:
| Name            | Required | Default  | Type                  | Description                     |
| ----------------| :-------:| :-------:| --------------------- | ------------------------------- |
| icon            | Yes      | N/A      | string (oneOf array)  | String for icon name            |
| customClass     | No       | ''       | string                | Additional class name to use in the component<br><br>**Note:** CSS Module can be passed through (example: `customClass={styles.cssModule}`) |
| title           | No       | N/A      | string                | Alternative text, describes what icon is |
| role            | No       | N/A      | string                | Add (valid) role attribute to SVG|
| presentational  | No       | N/A      | bool                  | Add this prop if the icon is considered non-meaningful, or presentational only. These are icons that accompany text |

### To add a new icon:
1. Go to [Font Awesome](http://fontawesome.io/icons/) and find the icon you want to use
1. Download or copy/paste raw SVG from [`Font-Awesome-SVG-PNG`](https://github.com/encharm/Font-Awesome-SVG-PNG/tree/master/black/svg)
1. Create a new file in `/icons` using FA name (example: `iconName.svg`)
1. Import the icon to `index.js` (example: `import iconName from './icons/iconName.svg';`)
1. Add `iconName` to the icons array (used for PropType validation)
