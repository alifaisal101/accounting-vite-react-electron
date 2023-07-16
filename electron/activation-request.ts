import { machineIdSync } from 'node-machine-id';

import InitalModel from './models/inital';

export default async () => {
  const machineId = machineIdSync();
  const responce = await fetch(`${process.env.SERVER_URL}activate`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      machineId,
      apiKey: process.env.ACTIVATION_API,
    }),
  });

  const { secret, privateKey } = await responce.json();

  if (!secret || !privateKey) {
    throw new Error('Failed to send an activation request');
  }

  const key = new InitalModel({ define: 'key', key: machineId });

  await key.save();
};
