import {createSelector} from '@reduxjs/toolkit';

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
    for (const [key, value] of Object.entries(json)) {
      arr.push({
        label: <>
          <span style={{color: 'blue'}}> {`{{${key}}}`} </span> &nbsp;
          <span style={{fontStyle: 'italic'}}> {value} </span>
        </>,
        value: key
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

export { getEnvVarsString, getEnvVarsAutoCompleteArray, getEnvVarsJson }
