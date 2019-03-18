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

type RequiredProps = {
  [key: string]: string | number | PropTypeValidator;
};

export default function elementWithProps(
  Component: React.ComponentType<any>,
  requiredProps: RequiredProps
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

    Object.keys(requiredProps).forEach(requiredProp => {
      const innerProps = propValue.props;
      const innerValue = innerProps[requiredProp];
      const expectedValue = requiredProps[requiredProp];

      if (typeof expectedValue === 'function') {
        // assume it's another propTypes because there's no use case for comparing two function
        const result = expectedValue(
          innerProps,
          requiredProp,
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
      if (!innerValue) {
        throw new TypeError(
          `${requiredComponentName} must be rendered with props \`${requiredProp}\`, e.g: <${componentName} ${propName}={<${requiredComponentName} ${requiredProp}=${formatProps(
            expectedValue
          )}/>} />`
        );
      }

      if (innerValue !== expectedValue) {
        throw new TypeError(
          `Invalid \`${requiredProp}\` value (${formatProps(
            innerValue
          )}) supplied to \`${requiredComponentName}\`, expected ${formatProps(
            expectedValue
          )}`
        );
      }
    });
  }

  return validator;
}
