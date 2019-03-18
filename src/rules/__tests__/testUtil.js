import getComponentName from '../../utils/getComponentName';

export function assertPass(element, propTypes) {
  Object.keys(propTypes).forEach(prop => {
    const validator = propTypes[prop];
    const componentName = getComponentName(element.type);
    expect(() => validator(element.props, prop, componentName)).not.toThrow();
  });
}

export function assertFail(element, propTypes) {
  Object.keys(propTypes).forEach(prop => {
    const validator = propTypes[prop];
    const componentName = getComponentName(element.type);
    expect(() => validator(element.props, prop, componentName)).toThrow();
  });
}
