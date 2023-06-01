const getVerifiedParentPaths = (parentPaths) => Object.keys(parentPaths).filter((path) => parentPaths[path].verified)

const getVerifiedVariablePaths = (variablePaths) => Object.keys(variablePaths).filter((path) => variablePaths[path].verified)

const getVerifiedVariablePathsWithValues = (variablePaths) => {
  const verifiedVariablePaths = getVerifiedVariablePaths(variablePaths);
  const verifiedVariablePathsWithValues = {};
  verifiedVariablePaths.forEach((path) => {
    const {value, type} = variablePaths[path].variable
    verifiedVariablePathsWithValues[path] = {value, type};
  })

  return verifiedVariablePathsWithValues;
}

export { getVerifiedParentPaths, getVerifiedVariablePaths, getVerifiedVariablePathsWithValues}