import {createSelector} from '@reduxjs/toolkit';
import { flatten } from 'flat';
import _ from 'lodash';

const getEnvVarsString = createSelector(
  [
    (state) => state.envData
  ],
  (envData) => envData.envVarsString
);

const getEnvVarsAutoCompleteArray = createSelector(
  [
    (state) => state.envData
  ],
  (envData) => {
    const json = JSON.parse(envData.envVarsString);
    const arr = [];
    if(_.isEmpty(json)) return arr;

    const flattenedJson = flatten({ env: json })
    for (const [key, value] of Object.entries(flattenedJson)) {
      arr.push({
        label: <>
          <span style={{color: 'green'}}> {`{{${key}}}`} </span> &nbsp;
          <span style={{fontStyle: 'italic'}}> {value} </span>
        </>,
        value: key
      })
    }
    return arr;
  }
);

const getEnvVarsEditorAutoSuggestArray = createSelector(
  [
    (state) => state.envData
  ],
  (envData) => {
    const json = JSON.parse(envData.envVarsString);
    const arr = [];
    if(_.isEmpty(json)) return arr;
    const flattenedJson = flatten({ env: json })
    for (const [key, value] of Object.entries(flattenedJson)) {
      arr.push({
        label: `{{${key}}}`,
        insertText: `{{${key}}}`
      })
    }
    return arr;
  }
);

const getEnvVarsJson = createSelector(
  [
    (state) => state.envData
  ],
  (envData) => JSON.parse(envData.envVarsString)
);

const getDispose = createSelector(
  [
    (state) => state.envData
  ],
  (envData) => JSON.parse(envData.dispose)
);

export { getDispose, getEnvVarsString, getEnvVarsAutoCompleteArray, getEnvVarsJson, getEnvVarsEditorAutoSuggestArray }
