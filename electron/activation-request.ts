import { machineIdSync } from 'node-machine-id';
import { dirname, join } from 'path';
import { writeFileSync } from 'fs';

const rootFs = dirname(__dirname);

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

  const secret_buffer = Buffer.from(secret.data);

  writeFileSync(join(rootFs, '.define.key'), privateKey);
  writeFileSync(join(rootFs, '.define.secret'), secret_buffer);
};
