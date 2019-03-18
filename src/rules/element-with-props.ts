import * as React from 'react';
import formatProps from '../utils/formatProps';
import getComponentName from '../utils/getComponentName';

type AnyProps = {
  [key: string]: any;
};

export default function elementWithProps(
  Component: React.ComponentType<any>,
  requiredProps: AnyProps
) {
  const requiredComponentName = getComponentName(Component);
  function validator(props: AnyProps, propName: string, componentName: string) {
    const propValue = props[propName];
    if (!propValue) {
      throw new Error(
        `${componentName} must provide \`${propName}\` prop which equal to react element ${requiredComponentName}, e.g: <${componentName} ${propName}={<${requiredComponentName} />} />`
      );
    }

    const passedComponentName = getComponentName(propValue.type);
    if (passedComponentName !== requiredComponentName) {
      throw new Error(
        `${componentName} must provide \`${propName}\` prop with react element \`${requiredComponentName}\`, but found \`${passedComponentName}\``
      );
    }

    Object.keys(requiredProps).forEach(requiredProp => {
      const innerValue = propValue.props[requiredProp];
      const expectedValue = requiredProps[requiredProp];
      if (!innerValue) {
        throw new Error(
          `${requiredComponentName} must be rendered with props \`${requiredProp}\`, e.g: <${componentName} ${propName}={<${requiredComponentName} ${requiredProp}=${formatProps(
            expectedValue
          )}/>} />`
        );
      }

      if (innerValue !== expectedValue) {
        throw new Error(
          `${requiredComponentName} must be rendered with prop ${requiredProp}=${formatProps(
            expectedValue
          )} but found ${formatProps(innerValue)}`
        );
      }
    });
  }

  return validator;
}
