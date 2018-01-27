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
import { BpkCodeBlock } from 'bpk-component-code';
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
          <BpkCodeBlock>
            {`import BpkComponentStarRating from 'bpk-component-star-rating';

...

            return (
              <BpkComponentStarRating
maxRating: 5
rating: 3.5
large: true
                >
            );`}
          </BpkCodeBlock>
        </div>
      );
    }
  }
  BpkDemo.displayName = wrapDisplayName(Component, 'bpkDemo');

  BpkDemo.propTypes = {
    style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string,
    customPropValues: PropTypes.object,
  };

  BpkDemo.defaultProps = {
    style: null,
    className: null,
    customPropValues: {},
  };

  return BpkDemo;
}
