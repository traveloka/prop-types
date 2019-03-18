import secret from 'prop-types/lib/ReactPropTypesSecret';
import getComponentName from '../../utils/getComponentName';

export function assertPass(
  element,
  propTypes,
  location = '',
  propFullName = ''
) {
  Object.keys(propTypes).forEach(prop => {
    const validator = propTypes[prop];
    const componentName = getComponentName(element.type);
    expect(() =>
      validator(
        element.props,
        prop,
        componentName,
        location,
        propFullName,
        secret
      )
    ).not.toThrow();
  });
}

export function assertFail(
  element,
  propTypes,
  location = '',
  propFullName = ''
) {
  Object.keys(propTypes).forEach(prop => {
    const validator = propTypes[prop];
    const componentName = getComponentName(element.type);
    expect(() =>
      validator(
        element.props,
        prop,
        componentName,
        location,
        propFullName,
        secret
      )
    ).toThrow();
  });
}
