# More examples

## Integration with component libraries

Our input masks are also easily integrated with component libraries.

* [`material-ui`](http://material-ui.com) (v0.x-stable) with [`redux-form-material-ui`](http://erikras.github.io/redux-form-material-ui/) wrappers
* [`material-ui@next`](https://material-ui-next.com/) (v1-beta) with [`redux-form-material-ui@next`](http://erikras.github.io/redux-form-material-ui/) wrappers
* [`semantic-ui-react`](https://react.semantic-ui.com)

## Validation

It is easy to create `redux-form`'s validations to any `Field` formatted with `createNumberMask`. Validation functions can be as simple as

```jsx
const validation = value => value > 10 ? 'Maximum value is 10' : '';

(...)

<Field
  name="my-numeric-field"
  component={TextField}
  type="tel"
  validate={validation}
  {...createNumberMask()}
/>
```