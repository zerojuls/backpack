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

import React, { type Node, type ComponentType, type String, type ObjectType } from 'react';
import PropTypes from 'prop-types';
import querystring from 'querystring';
import { wrapDisplayName } from 'bpk-react-utils';
import { BpkCodeBlock } from 'bpk-component-code';
import EditIconSm from 'bpk-component-icon/sm/edit';
import reactDocs from 'react-docgen';
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

    generateCode = props => {
      return `import BpkComponentStarRating from 'bpk-component-star-rating';

    ...

    return (
        <BpkComponentStarRating
            maxRating: 5
            rating: 3.5
            large: true
        />
    );`;
    };

    onPropChanged = (propName, newValue) => {
      console.log(propName);
      console.log(newValue);
      const newProps = JSON.parse(JSON.stringify(this.state.props));
      newProps[propName] = newValue;
      const newCode = this.generateCode(newProps);
      this.setState({ props: newProps, code: newCode });
      // TODO SET URI TO INCLUDE NEW this.state.props WITHOUT REROUTING
      console.log(this.state.code);
    };

    componentWillMount = () => {
      const componentProps = {};
      const propTypes = Component.propTypes;
      const defaultProps = Component.defaultProps;

      const customPropValues = this.props.customPropValues;
      // For each prop, if a customPropValue is provided, that will be used.
      // Otherwise, if a defaultPropValue is provided, that will be used instead.
      // As a last resort, the defaultProp value from the component itself will be used.
      for (let i = 0; i < Object.keys(propTypes).length; i += 1) {
        const propName = Object.keys(propTypes)[i];
        console.log(propName);
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
        componentProps[propName] = propValue;
      }
      const code = this.generateCode(componentProps);
      this.setState({ props: componentProps, code: code });
      console.log(this.state.code);
    };

    render(): Node {
      const { compact, style, className, ...rest } = this.props;

      const classNameFinal = [getClassName('bpk-demo__container')];
      if (compact) classNameFinal.push(getClassName('bpk-demo__container--compact'));
      if (className) classNameFinal.push(className);

      const showPlayground = !compact;

      return (
        <div style={style} className={classNameFinal.join(' ')}>
          {showPlayground && (
            <div className={getClassName('bpk-demo__props')}>
              {Object.keys(this.state.props).map((p, i) => (
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
              href={`#playground?${querystring.stringify(this.state.props)}`}
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
    customPropValues: PropTypes.object,
  };

  BpkDemo.defaultProps = {
    compact: true,
    style: null,
    className: null,
    customPropValues: {},
  };

  return BpkDemo;
}
