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

import React, { type Node } from 'react';
import PropTypes from 'prop-types';
import BpkCheckBox from 'bpk-component-checkbox';
import DemoBooleanComponent from './DemoBooleanComponent';
import DemoStringComponent from './DemoStringComponent';
import DemoNumberComponent from './DemoNumberComponent';

import STYLES from './bpk-demo.scss';

// This was originally depended upon from the bpk-react-utils package, however
// we decided to inline it in this particular component so as not to bloat the
// the bundles of consumers who are not yet on webpack 2
// We'll revisit this again soon.
const cssModules = (styles = {}) => className =>
  styles[className] ? styles[className] : className;

const getClassName = cssModules(STYLES);

type Props = {
  propName: Node,
  className: ?string,
};

const DemoControl = (props: Props) => {
  const { propName, className, onChange, value, ...rest } = props;

  console.log(value);

  let EditorComponent = null;
  switch (typeof value) {
    case 'boolean':
      EditorComponent = DemoBooleanComponent;
      break;
    case 'number':
      EditorComponent = DemoNumberComponent;
      break;
    case 'string':
      EditorComponent = DemoStringComponent;
      break;
    case 'function':
      EditorComponent = DemoFunctionComponent;
      break;
    default:
      EditorComponent = DemoStringComponent;
  }

  return (
    <EditorComponent
      className={getClassName('bpk-demo__prop-editor')}
      value={value}
      onChange={newValue => {
        onChange(propName, newValue);
      }}
      propName={propName}
      {...rest}
    />
  );
};

DemoControl.propTypes = {
  propName: PropTypes.string.isRequired,
  className: PropTypes.string,
};

DemoControl.defaultProps = {
  className: null,
};

export default DemoControl;
