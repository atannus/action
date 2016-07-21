import React, {Component} from 'react';

export default ComposedComponent => {
  return class LazyStyleUpdate extends Component {
    shouldComponentUpdate(nextProps) {
      let willUpdate = false;
      Object.keys(this.props).forEach(prop => {
        const propName = this.props[prop];
        const nextPropName = nextProps[prop];
        if (propName !== nextPropName) {
          if (typeof propName === 'object') {
            if (propName.$$typeof === nextPropName.$$typeof) {
              return false;
            }
          }
          console.log(prop, propName, nextPropName);
          willUpdate = true;
        }
      });
      return willUpdate;
    }

    render() {
      return <ComposedComponent {...this.props}/>;
    }
  };
};
