import React from 'react';
import PropTypes from 'prop-types';
import ElementWithProps from '../element-with-props';

import { assertPass, assertFail } from './testUtil';

const A = () => null;
const B = () => null;
const C = () => null;

const propTypes = {
  b: ElementWithProps(B, { x: 'y' }),
};

describe('validate missing props', () => {
  test('no props', () => {
    assertFail(<A />, propTypes);
  });

  test('no matching props', () => {
    assertFail(<A c="" />, propTypes);
  });
});

describe('validate component name', () => {
  test('different component', () => {
    assertFail(<A b={<C />} />, propTypes);
    assertFail(<A b={<div />} />, propTypes);
  });

  test('different component correct inner props', () => {
    assertFail(<A b={<C x="y" />} />, propTypes);
    assertFail(<A b={<div x="y" />} />, propTypes);
  });

  test('correct component', () => {
    assertPass(<A b={<B x="y" />} />, propTypes);
  });
});

describe('validate missing inner props', () => {
  test('no inner props', () => {
    assertFail(<A b={<B />} />, propTypes);
  });

  test('no inner props with additional props', () => {
    assertFail(<A b={<B z="a" b="c" />} />, propTypes);
  });
});

describe('validate inner props', () => {
  test('different inner props', () => {
    assertFail(<A b={<B x="x" />} />, propTypes);
  });

  test('correct inner props', () => {
    assertPass(<A b={<B x="y" />} />, propTypes);
  });

  test('correct inner props with additional props', () => {
    assertPass(<A b={<B x="y" z="a" b="c" />} />, propTypes);
  });

  test('boolean inner props value', () => {
    assertPass(<A b={<B x />} />, { b: ElementWithProps(B, { x: true }) });
    assertPass(<A b={<B x={false} />} />, {
      b: ElementWithProps(B, { x: false }),
    });

    assertFail(<A b={<B x />} />, { b: ElementWithProps(B, { x: false }) });
    assertFail(<A b={<B x={false} />} />, {
      b: ElementWithProps(B, { x: true }),
    });
  });

  test('null inner props value', () => {
    const nullPropTypes = { b: ElementWithProps(B, { x: null }) };

    assertPass(<A b={<B x={null} />} />, nullPropTypes);

    assertFail(<A b={<B />} />, nullPropTypes);
    assertFail(<A b={<B x />} />, nullPropTypes);

    // falsy
    assertFail(<A b={<B x={false} />} />, nullPropTypes);
    assertFail(<A b={<B x={0} />} />, nullPropTypes);
    assertFail(<A b={<B x="" />} />, nullPropTypes);
  });
});

describe('support other prop-types', () => {
  test('native prop-types', () => {
    const propTypes = {
      b: ElementWithProps(B, {
        x: PropTypes.number.isRequired,
        y: PropTypes.string,
      }),
    };

    // y is optional
    assertPass(<A b={<B x={1} />} />, propTypes);
    assertPass(<A b={<B x={1} y="2" />} />, propTypes);

    // x is required
    assertFail(<A b={<B />} />, propTypes);
    assertFail(<A b={<B y={2} />} />, propTypes);
    assertFail(<A b={<B y="2" />} />, propTypes);

    // either prop is incorrect
    assertFail(<A b={<B x="1" />} />, propTypes);
    assertFail(<A b={<B x={1} y={2} />} />, propTypes);
    assertFail(<A b={<B x="1" y={2} />} />, propTypes);
    assertFail(<A b={<B x="1" y="2" />} />, propTypes);
  });
});
