export const isValidWindowsPath = (path: string) => {
  if (
    path.charAt(0) != '\\' ||
    path.charAt(1) != '\\' ||
    path.charAt(0) != '/' ||
    path.charAt(1) != '/'
  ) {
    if (!path.charAt(0).match(/^[a-zA-Z]/)) {
      return false;
    }
    if (!path.charAt(1).match(/^[:]/) || !path.charAt(2).match(/^[\/\\]/)) {
      return false;
    }
  }
  return true;
};

export const isValidLinuxPath = (path: string) => {
  for (var k = 0; k < path.length; k++) {
    if (path.charAt(k).match(/^[\\]$/)) {
      return false;
    }
  }
  if (path.charAt(0) != '/') {
    return false;
  }
  if (path.charAt(0) == '/' && path.charAt(1) == '/') {
    return false;
  }
  return true;
};
