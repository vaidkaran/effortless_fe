const getVerifiedParentPaths = (parentPaths) => Object.keys(parentPaths).filter((path) => parentPaths[path].verified)

const getVerifiedVariablePaths = (variablePaths) => Object.keys(variablePaths).filter((path) => variablePaths[path].verified)

const getVerifiedVariablePathsWithValues = (variablePaths) => {
  // console.log('*****', variablePaths)
  const verifiedVariablePaths = getVerifiedVariablePaths(variablePaths);
  // console.log('vv*****', verifiedVariablePaths)
  const verifiedVariablePathsWithValues = {};
  verifiedVariablePaths.forEach((path) => {
    // console.log('----path:', path)
    // console.log('----Vpath:', variablePaths[path])
    const {value, type} = variablePaths[path].variable
    verifiedVariablePathsWithValues[path] = {value, type};
  })

  return verifiedVariablePathsWithValues;
}

export { getVerifiedParentPaths, getVerifiedVariablePaths, getVerifiedVariablePathsWithValues}