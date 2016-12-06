## Scroller

Scroller is a wrapping component. You can wrap an element with Scroller to give that element a max-height with overflow scrollability. The default `maxHeight` is `50vh` but if you'd like that to be something different, like `200px` or `10em`, just pass that into `maxHeight` prop on Scroller.

### Props:
| Name            | Required  | Default   | Type                      | Description                           |
| ----------------| :--------:| :--------:| ------------------------- | ------------------------------------- |
| maxHeight       | No        | `50vh`    | string                    | Sets inline `maxHeight` property on parent |


### Example:
```js
import Scroller from '../Global/Scroller';

<Scroller maxHeight='250px'>
  {listofItems}
</Scroller>
```
