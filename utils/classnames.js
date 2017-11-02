import _ from 'lodash';
import classnames from 'classnames';

const classnames = (prefix, styles) => {
  const cx = classnames.bind(styles);
  return (...names) =>
    cx(
      _.map(names, name => {
        if (typeof name === 'string') {
          return `${prefix}-${name}`;
        } else if (typeof name === 'object') {
          const returnObj = {};
          for (const key in name) {
            if (Object.prototype.hasOwnProperty.call(name, key)) {
              const element = name[key];
              returnObj[`${prefix}-${key}`] = element;
            }
          }
          return returnObj;
        }
        return '';
      })
    );
};

module.exports = { classnames };
