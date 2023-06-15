const pathSeparator = '.';

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

const canBeRemovedFromVerifiedParentPaths = ({ path, parentPaths, variablePaths }) => {
  const verifiedParentPaths = Object.keys(parentPaths).filter((path) => parentPaths[path].verified);
  const verifiedVariablePaths = Object.keys(variablePaths).filter((path) => variablePaths[path].verified);
  const childPaths = [...verifiedParentPaths, ...verifiedVariablePaths];
  const childAlreadySelected = childPaths.some((verifiedChildPath) => verifiedChildPath.match(new RegExp(`^${path}${pathSeparator}.+`)));

  return !childAlreadySelected; // cannot be marked as unverified if child is selected
}

export { getVerifiedParentPaths, getVerifiedVariablePaths, getVerifiedVariablePathsWithValues, canBeRemovedFromVerifiedParentPaths }