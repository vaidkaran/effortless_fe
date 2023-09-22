import {createSelector} from '@reduxjs/toolkit';
import { flatten } from 'flat';

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
    const flattenedJson = flatten({ env: json })
    const arr = [];
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
    const flattenedJson = flatten({ env: json })
    const arr = [];
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

export { getEnvVarsString, getEnvVarsAutoCompleteArray, getEnvVarsJson, getEnvVarsEditorAutoSuggestArray }
