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
import { wrapDisplayName } from 'bpk-react-utils';
import reactDocs from 'react-docgen';
import requiredDefaultProps from './requiredDefaultProps.json';
import DemoControl from './DemoControl';

type BpkDemo = {
  className: ?string,
  style: ?{},
};

type BpkDemoState = {
  inView: boolean,
};

export default function bpkDemo(
  Component: ComponentType<any>,
  requiredPropValues: ObjectType,
): ComponentType<any> {
  class BpkDemo extends React.Component<BpkDemo, BpkDemoState> {
    element: ?HTMLElement;
    state: BpkDemoState;

    static defaultProps: {};

    constructor(): void {
      super();

      this.state = {
        props: {},
      };
    }

    onPropChanged = (propName, newValue) => {
      console.log(propName);
      console.log(newValue);
      const newProps = JSON.parse(JSON.stringify(this.state.props));
      newProps[propName] = newValue;
      this.setState({ props: newProps });
    };

    componentWillMount = () => {
      const componentProps = {};
      const propTypes = Component.propTypes;
      const defaultProps = Component.defaultProps;
      // Foreach prop, if has default prop value, add to componentProps with default value.
      // If no default value is provided by the component, we need to look it up
      // from requiredPropValues
      for (let i = 0; i < Object.keys(propTypes).length; i += 1) {
        const propName = Object.keys(propTypes)[i];
        console.log(propName);
        let defaultPropValue = null;
        if (Object.keys(defaultProps).includes(propName)) {
          defaultPropValue = defaultProps[propName];
        } else {
          defaultPropValue = requiredPropValues[propName];
        }
        componentProps[propName] = defaultPropValue;
      }
      this.setState({ props: componentProps });
    };

    render(): Node {
      const { style, className, ...rest } = this.props;

      return (
        <div style={style} className={className}>
          {Object.keys(this.state.props).map((p, i) => (
            <DemoControl onChange={this.onPropChanged} value={this.state.props[p]} propName={p} />
          ))}
          <Component {...this.state.props} {...rest} />
        </div>
      );
    }
  }
  BpkDemo.displayName = wrapDisplayName(Component, 'bpkDemo');

  BpkDemo.propTypes = {
    style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string,
  };

  BpkDemo.defaultProps = {
    style: null,
    className: null,
  };

  return BpkDemo;
}
