import { execSync } from 'child_process';
import { dirname } from 'path';

const rootFs = dirname(__dirname);
const startActivatorInstance = `cd ${rootFs} && node activate.js`;

export default async () => {
  const stout = execSync(startActivatorInstance).toString();

  if (stout.includes("'Ia]>g'p=$8q*!1=z%lWI.[HCNcy:B")) {
    return 'activated';
  } else {
    throw new Error('failed to activate');
  }
};
