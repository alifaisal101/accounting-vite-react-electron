const fs = require('fs');

export const checkDirectoryAccess = (
  directoryPath: string
): Promise<Boolean> => {
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

export const checkFileAccess = (filePath: string): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // File does not exist or access is denied
        resolve(false);
      } else {
        // Check if the file is readable
        fs.access(filePath, fs.constants.R_OK, (err) => {
          if (err) {
            // File is not readable
            resolve(false);
          } else {
            // Check if the file is writable
            fs.access(filePath, fs.constants.W_OK, (err) => {
              if (err) {
                // File is not writable
                resolve(false);
              } else {
                // File exists and is readable and writable
                resolve(true);
              }
            });
          }
        });
      }
    });
  });
};
