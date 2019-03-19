import * as React from 'react';
import formatProps from '../utils/formatProps';
import getComponentName from '../utils/getComponentName';

type AnyProps = {
  [key: string]: any;
};

type PropTypeValidator = (
  props: AnyProps,
  propName: string,
  componentName: string,
  ...rest: any[]
) => void | Error;

type PrimitiveValue = undefined | null | string | number | boolean;
type ExpectedPropValue = PrimitiveValue | PropTypeValidator;

type ExpectedProps = {
  [key: string]: ExpectedPropValue;
};

export default function elementWithProps(
  Component: React.ComponentType<any>,
  expectedProps: ExpectedProps
): PropTypeValidator {
  const requiredComponentName = getComponentName(Component);
  function validator(
    props: AnyProps,
    propName: string,
    componentName: string,
    ...rest: any[]
  ) {
    const propValue: React.ReactElement<AnyProps> = props[propName];
    if (!propValue) {
      throw new TypeError(
        `${componentName} must provide \`${propName}\` prop which equal to react element ${requiredComponentName}, e.g: <${componentName} ${propName}={<${requiredComponentName} />} />`
      );
    }

    const passedComponentName = getComponentName(propValue.type);
    if (passedComponentName !== requiredComponentName) {
      throw new TypeError(
        `${componentName} must provide \`${propName}\` prop with react element \`${requiredComponentName}\`, but found \`${passedComponentName}\``
      );
    }

    Object.keys(expectedProps).forEach(expectedProp => {
      const innerProps = propValue.props;
      const innerValue = innerProps[expectedProp] as PrimitiveValue;
      const expectedValue = expectedProps[expectedProp];

      if (typeof expectedValue === 'function') {
        // assume it's another propTypes because there's no use case for comparing two function
        const result = expectedValue(
          innerProps,
          expectedProp,
          requiredComponentName,
          ...rest
        );

        if (result) {
          throw result;
        }

        // we return early to allow optional props
        return;
      }

      // if we're comparing value (instead of another prop types), we need to make sure that the inner prop value is defined
      if (innerValue === undefined) {
        throw new TypeError(
          `Expected \`${requiredComponentName}\` to be rendered with props \`${expectedProp}\`, e.g: <${componentName} ${propName}={<${requiredComponentName} ${expectedProp}=${formatProps(
            expectedValue
          )} />} />`
        );
      }

      if (innerValue !== expectedValue) {
        throw new TypeError(
          `Invalid prop ${expectedProp}=${formatProps(
            innerValue
          )} supplied to \`${requiredComponentName}\`, expected ${expectedProp}=${formatProps(
            expectedValue
          )}`
        );
      }
    });
  }

  return validator;
}
