import fs from 'fs';
import path from 'path';

import {appDist} from '../../shared/config/paths';
import config from '../../shared/config';

const staticAssets = [path.join(appDist, 'index.html')];

// Taken from react-scripts/check-required-files, but without console.logs.
const doFilesExist = (files: Array<string>) => {
  try {
    files.forEach((filename) => {
      fs.accessSync(filename, fs.constants.F_OK);
    });
    return true;
  } catch (err) {
    return false;
  }
};

const enforcePrerequisites = () =>
  new Promise<void>((resolve, reject: (error: Error) => void) => {
    // Ensures that WebAssembly support is present
    if (typeof WebAssembly === 'undefined') {
      reject(new Error('WebAssembly is not supported in this environment!'));
      return;
    }

    // Ensure static assets exist if they need to be served
    if (!doFilesExist(staticAssets) && config.serveAssets !== false) {
      reject(new Error(`Static assets are missing.`));
      return;
    }

    resolve();
  });

export default enforcePrerequisites;
