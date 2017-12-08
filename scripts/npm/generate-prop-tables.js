// 'use strict'; // eslint-disable-line

/*
 * Backpack - Skyscanner's Design System
 *
 * Copyright 2017 Skyscanner Ltd
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

/* eslint-disable no-console */
// Note, this requires global installation of packages `react-docgen` and `marked`
const fs = require('fs');
const { execSync } = require('child_process');
const marked = require('marked');
const reactDocs = require('react-docgen');

const getReadmeFile = componentFileName => {
  const fileNameSplit = componentFileName.split('/');
  fileNameSplit.shift();
  fileNameSplit.pop();
  fileNameSplit[fileNameSplit.length - 1] = 'readme.md';
  const readmeFileName = fileNameSplit.join('/');
  if (fs.existsSync(readmeFileName)) {
    return readmeFileName;
  }
  return null;
};

const generatePropRows = propInfo => {
  const requiredPropRows = [];
  const optionalPropRows = [];
  for (let i = 0; i < Object.keys(propInfo).length; i += 1) {
    const propName = Object.keys(propInfo)[i];
    const prop = Object.values(propInfo)[i];
    let defaultValue = '-';
    if (prop.defaultValue !== null && prop.defaultValue !== undefined) {
      defaultValue = prop.defaultValue.value;
    }
    const newPropRow = {
      name: propName,
      type: prop.type.name,
      required: prop.required,
      defaultValue,
    };
    const listToPush = newPropRow.required ? requiredPropRows : optionalPropRows;
    listToPush.push(newPropRow);
  }
  return { optionalPropRows, requiredPropRows };
};

const calculateColumnWidths = tableData => {
  const columnWidths = [];
  const columnCount = Object.keys(tableData[0]).length;
  const rowCount = tableData.length;
  for (let c = 0; c < columnCount; c += 1) {
    let columnWidth = 0;
    for (let i = 0; i < rowCount; i += 1) {
      const tableValue = Object.values(tableData[i])[c].toString();
      columnWidth = Math.max(columnWidth, tableValue.length);
    }
    columnWidths.push(columnWidth);
  }
  return { columnCount, rowCount, columnWidths };
};

const sortPropRowsByName = propRows => {
  propRows.sort((a, b) => a.name - b.name);
  return propRows;
};

const pad = (s, l) => {
  if (s === '---') {
    return ` ${'-'.repeat(l)} `;
  }
  const paddingLength = l - s.toString().length;
  return ` ${s}${' '.repeat(paddingLength)} `;
};

const prettyFormatPropRows = (requiredPropRowsSorted, optionalPropRowsSorted) => {
  const header = [
    {
      name: 'Property',
      type: 'PropType',
      required: 'Required',
      defaultValue: 'Default Value',
    },
    {
      name: '---',
      type: '---',
      required: '---',
      defaultValue: '---',
    },
  ];
  const tableData = header.concat(requiredPropRowsSorted).concat(optionalPropRowsSorted);
  const { columnCount, rowCount, columnWidths } = calculateColumnWidths(tableData);
  let tableString = '';
  for (let r = 0; r < rowCount; r += 1) {
    for (let c = 0; c < columnCount; c += 1) {
      tableString += `|${pad(Object.values(tableData[r])[c], columnWidths[c])}`;
    }
    tableString += '|\n';
  }
  return tableString;
};

const rewriteReadmeFile = (readmeFilePath, tableString) => {
  console.log(tableString);
  return;
  if (readmeFilePath === null || readmeFilePath === undefined) {
    return;
  }
  let finalValue = '';

  try {
    const readmeContent = fs.readFileSync(readmeFilePath);
    finalValue += readmeContent.split('## Props')[0];
    finalValue += `\n## Props\n\n${tableString}`;
    console.log(`\n\n${finalValue}\n\n`);

    fs.writeFileSync(readmeFilePath, finalValue);
    console.log(`file ${readmeFilePath} updated`);
  } catch (ex) {
    console.log(`error updating props in ${readmeFilePath}`);
  }
};

const updateProps = (componentSourceFile, componentReadmeFilePath) => {
  try {
    const src = fs.readFileSync(componentSourceFile);
    const componentInfo = reactDocs.parse(src);
    const propInfo = componentInfo.props;
    const { optionalPropRows, requiredPropRows } = generatePropRows(propInfo);
    const optionalPropRowsSorted = sortPropRowsByName(optionalPropRows);
    const requiredPropRowsSorted = sortPropRowsByName(requiredPropRows);
    const tableString = prettyFormatPropRows(requiredPropRowsSorted, optionalPropRowsSorted);
    // const propString = `## Props\n\n${tableString}`\n;

    rewriteReadmeFile(componentReadmeFilePath, tableString);
  } catch (ex) {
    console.log(`error getting information from ${componentSourceFile}`);
  }
};

console.log('Updating prop tables');
console.log('');

// eslint-disable-next-line max-len
let ComponentSourceFiles = execSync(
  'find . * | grep -v node_modules | grep -E ".*Bpk[A-Za-z]+.js$"',
)
  .toString()
  .split('\n');
ComponentSourceFiles = ComponentSourceFiles.filter(s => s !== '');

ComponentSourceFiles.forEach(sf => {
  const componentReadmeFilePath = getReadmeFile(sf);
  updateProps(sf, componentReadmeFilePath);
});

console.log('All done.  👍');
