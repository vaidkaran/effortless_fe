import {createSelector} from '@reduxjs/toolkit';

const getEnvVars = createSelector(
  [
    (state) => state.envData
  ],
  (envData) => envData.envVars
);

export { getEnvVars }
