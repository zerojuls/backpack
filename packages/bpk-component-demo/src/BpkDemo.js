/*
 * Backpack - Skyscanner's Design System
 *
 * Copyright 2018 Skyscanner Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* @flow */

import React, {
  type Node,
  type ComponentType,
  type String,
  type ObjectType,
} from 'react';
import PropTypes from 'prop-types';
import querystring from 'querystring';
import { wrapDisplayName } from 'bpk-react-utils';
import { BpkCodeBlock } from 'bpk-component-code';
import EditIconSm from 'bpk-component-icon/sm/edit';
import reactDocs from 'react-docgen';
import { browserHistory, PropTypes as RouterPropTypes } from 'react-router';
import requiredDefaultProps from './requiredDefaultProps.json';
import DemoControl from './DemoControl';
import { cssModules } from 'bpk-react-utils';

import STYLES from './bpk-demo.scss';

const getClassName = cssModules(STYLES);

type BpkDemo = {
  className: ?string,
  style: ?{},
};

type BpkDemoState = {
  inView: boolean,
};

export default function bpkDemo(
  Component: ComponentType<any>,
  componentName: String,
  packageName: String,
  defaultPropValues: ObjectType,
): ComponentType<any> {
  class BpkDemo extends React.Component<BpkDemo, BpkDemoState> {
    element: ?HTMLElement;
    state: BpkDemoState;

    static defaultProps: {};

    constructor(): void {
      super();

      this.state = {
        props: {},
        code: 'hello!',
      };
    }

    componentWillMount = () => {
      // TODO THIS ROUTE-CHANGE LISTENER DOESN'T WORK!
      browserHistory.listen(location => {
        if (`${location}`.includes('?')) {
          this.setState({
            props: this.getUrlProps(),
          });
        }
      });

      const componentProps = {};
      const { propTypes, defaultProps } = Component;

      const { customPropValues } = this.props;
      const urlParameterPropValues = this.getUrlProps();
      // For each prop, if a customPropValue is provided, that will be used.
      // Otherwise, if a defaultPropValue is provided, that will be used instead.
      // As a last resort, the defaultProp value from the component itself will be used.
      for (let i = 0; i < Object.keys(propTypes).length; i += 1) {
        const propName = Object.keys(propTypes)[i];
        let propValue = null;
        if (Object.keys(defaultProps).includes(propName)) {
          propValue = defaultProps[propName];
        }
        if (Object.keys(defaultPropValues).includes(propName)) {
          propValue = defaultPropValues[propName];
        }
        if (Object.keys(customPropValues).includes(propName)) {
          propValue = customPropValues[propName];
        }
        if (
          !this.props.compact &&
          Object.keys(urlParameterPropValues).includes(propName)
        ) {
          propValue = urlParameterPropValues[propName];
        }
        componentProps[propName] = propValue;
      }
      const code = this.generateCode(componentProps);
      this.setState({ props: componentProps, code });
    };

    onPropChanged = (propName, newValue) => {
      const newProps = JSON.parse(JSON.stringify(this.state.props));
      newProps[propName] = newValue;
      const newCode = this.generateCode(newProps);
      this.setState({ props: newProps, code: newCode });
      browserHistory.push(
        `${
          `${window.location}`.split('?')[0].split('#')[0]
        }?${querystring.stringify(newProps)}#playground`,
      );
    };

    getUrlProps = () => {
      const location = `${window.location}`;
      let urlPropQueryString = '';
      if (location.split('?').length > 1) {
        urlPropQueryString = location.split('?')[1];
      }
      if (urlPropQueryString.split('#').length > 1) {
        urlPropQueryString = location.split('#')[0];
      }
      const props = querystring.parse(urlPropQueryString);
      if (props === undefined) {
        return {};
      }
      console.log(props);
      for (let p = 0; p < Object.keys(props).length; p += 1) {
        const propName = Object.keys(props)[p];
        console.log(propName);
        console.log(props[propName]);
        if (props[propName] === 'true') {
          props[propName] = true;
        } else if (props[propName] === 'false') {
          props[propName] = false;
        } else if (props[propName].match(/([0-9]+)?(\.?[0-9]+)/)) {
          props[propName] = parseFloat(props[propName]);
        }
      }
      return props;
    };

    generateCode = props => {
      let finalString = `import ${componentName} from ${packageName};\n\n  ...\n\n`;
      finalString += `  return (\n    <${componentName}\n`;
      for (let p = 0; p < Object.keys(props).length; p += 1) {
        const propName = Object.keys(props)[p];
        const propValue = props[propName];
        if (propValue !== Component.defaultProps[propName]) {
          if (typeof propValue === 'string') {
            finalString += `      ${propName}="${propValue}"\n`;
          } else if (typeof propValue === 'boolean' && propValue === true) {
            finalString += `      ${propName}\n`;
          } else {
            finalString += `      ${propName}={${propValue}}\n`;
          }
        }
      }
      finalString += `    />\n  );`;
      return finalString;
    };

    render(): Node {
      const { compact, style, className, ...rest } = this.props;

      const classNameFinal = [getClassName('bpk-demo__container')];
      if (compact)
        classNameFinal.push(getClassName('bpk-demo__container--compact'));
      if (className) classNameFinal.push(className);

      const showPlayground = !compact;

      return (
        <div style={style} className={classNameFinal.join(' ')}>
          {showPlayground && (
            <div className={getClassName('bpk-demo__props')}>
              {Object.keys(this.state.props).map(p => (
                <DemoControl
                  className={getClassName('bpk-demo__prop-control')}
                  onChange={this.onPropChanged}
                  value={this.state.props[p]}
                  propName={p}
                />
              ))}
            </div>
          )}
          <div className={getClassName('bpk-demo__component')}>
            <Component {...this.state.props} {...rest} />
          </div>
          {compact && (
            <a
              href={`?${querystring.stringify(this.state.props)}#playground`}
              className={getClassName('bpk-demo__controls')}
            >
              <EditIconSm />
            </a>
          )}
          {showPlayground && (
            <div className={getClassName('bpk-demo__code')}>
              <BpkCodeBlock>{this.state.code}</BpkCodeBlock>
            </div>
          )}
        </div>
      );
    }
  }
  BpkDemo.displayName = wrapDisplayName(Component, 'bpkDemo');

  BpkDemo.propTypes = {
    compact: PropTypes.bool,
    style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string,
    customPropValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

  BpkDemo.defaultProps = {
    compact: true,
    style: null,
    className: null,
    customPropValues: {},
  };

  return BpkDemo;
}
