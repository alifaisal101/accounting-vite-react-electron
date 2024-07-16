const fs = require('fs');

const checkDirectoryAccess = (directoryPath: string): Promise<Boolean> => {
  return new Promise((resolve, reject) => {
    // Check if directory exists
    fs.access(directoryPath, fs.constants.F_OK, (err) => {
      if (err) {
        // Directory does not exist
        resolve(false);
      } else {
        // Directory exists, check read and write access
        fs.access(
          directoryPath,
          fs.constants.R_OK | fs.constants.W_OK,
          (err) => {
            if (err) {
              // Directory does not have read and write access
              resolve(false);
            } else {
              // Directory exists and has read and write access
              resolve(true);
            }
          }
        );
      }
    });
  });
};
