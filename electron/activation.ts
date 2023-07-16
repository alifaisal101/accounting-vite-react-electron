import InitalModel from './models/inital';

import { machineIdSync } from 'node-machine-id';

export default async () => {
  const key = await InitalModel.findOne({ define: 'key' });

  if (machineIdSync() === key?.key) {
    return true;
  } else {
    throw new Error('Activation Failed');
  }
};
