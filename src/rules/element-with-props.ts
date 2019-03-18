import * as React from 'react';
import formatProps from '../utils/formatProps';

type AnyProps = {
  [key: string]: any;
};

export default function elementWithProps(
  Component: React.ComponentType<any>,
  requiredProps: AnyProps
) {
  const requiredComponentName = Component.displayName || Component.name;
  function validator(props: AnyProps, propName: string, componentName: string) {
    const propValue = props[propName];
    if (!propValue) {
      throw new Error(
        `${componentName} must provide ${propName} prop which equal to react element ${requiredComponentName}, e.g: <${requiredComponentName} />`
      );
    }

    Object.keys(requiredProps).forEach(requiredProp => {
      const innerValue = propValue.props[requiredProp];
      const expectedValue = requiredProps[requiredProp];
      if (!expectedValue) {
        throw new Error(
          `${requiredComponentName} must be rendered with props ${requiredProp} like <${requiredComponentName} ${requiredProp}=${formatProps}/>`
        );
      }

      if (innerValue !== expectedValue) {
        throw new Error(
          `${requiredComponentName} must be rendered with props ${requiredProp} which equal ${formatProps(
            expectedValue
          )} but found ${formatProps(innerValue)}`
        );
      }
    });
  }

  return validator;
}
