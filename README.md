# prop-types

[![CircleCI](https://circleci.com/gh/traveloka/prop-types.svg?style=svg)](https://circleci.com/gh/traveloka/prop-types) [![codecov](https://codecov.io/gh/traveloka/prop-types/branch/master/graph/badge.svg)](https://codecov.io/gh/traveloka/prop-types)

> Custom prop-types used in Traveloka project for react prop validation that can't be covered using compile-time typecheck (such as Flow/Typescript)

## API

`ElementWithProps`

Used to validate certain prop to equal react element with predefined props

Example:

```js
import { ElementWithProps } from '@traveloka/prop-types';

const B = () => null;
const A = () => null;

A.propTypes = {
  b: ElementWithProps(B, { x: 'y', other: PropTypes.string })
}

// fail
<A b={<B />} />
<A b={<B x='x' />} />
<A b={<B y='x' />} />

// pass
<A b={<B x='y' />} />
<A b={<B x='y' other='any' />} />
```

## LICENSE

MIT
