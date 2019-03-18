import React from 'react';
import PropTypes from 'prop-types';
import ElementWithProps from '../element-with-props';

import { assertPass, assertFail } from './testUtil';

const A = () => null;
A.displayName = 'TestComponent';

const B = () => null;
B.displayName = 'CorrectComponent';

const C = () => null;
C.displayName = 'WrongComponent';

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
});

describe('support other prop-types', () => {
  test('official prop-types', () => {
    const propTypes = {
      b: ElementWithProps(B, {
        x: PropTypes.number.isRequired,
        y: PropTypes.string,
      }),
    };

    // props y is not required
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
