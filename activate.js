// const crypto = require('crypto');
// const { writeFileSync, readFileSync } = require('fs');
// const { join } = require('path');
// require('dotenv').config();

// for (let i = 0; i < 2; i++) {
//   console.log(i);
// }

// const key = readFileSync(join(__dirname, '.define.key'));
// const secret = readFileSync(join(__dirname, '.define.secret'));

// console.log(
//   {
//     //@ts-ignore
//     key: key.toString(),
//     oaepHash: process.env.OAEP_HASH,
//     //@ts-ignore
//     padding: crypto.constants[process.env.PADDING],
//     passphrase: '',
//   },
//   secret
// );

// const result = crypto.privateDecrypt(
//   {
//     //@ts-ignore
//     key: key.toString(),
//     oaepHash: process.env.OAEP_HASH,
//     //@ts-ignore
//     padding: crypto.constants[process.env.PADDING],
//     passphrase: '',
//   },
//   secret
// );

// console.log(result.toString());

// // process.on('message', (message) => {
// //   console.log(message);
// //   let mio = `i wanna die`;
// //   process.send(mio);
// // });

require('dotenv').config();

const crypto = require('crypto');
const { readFileSync } = require('fs');
const { machineIdSync } = require('node-machine-id');
const { join } = require('path');

const successCode = "'Ia]>g'p=$8q*!1=z%lWI.[HCNcy:B";
const machineId = machineIdSync();

const bootstrap = async () => {
  try {
    const key = readFileSync(join(__dirname, '.define.key'));
    const secret = readFileSync(join(__dirname, '.define.secret'));

    console.log(key.toString());

    const result = crypto.privateDecrypt(
      {
        key: key.toString(),
        oaepHash: process.env.OAEP_HASH,
        padding: crypto.constants[process.env.PADDING],
        passphrase: '',
      },
      secret
    );

    if (result.toString() === machineId) {
      console.log(successCode);
    } else {
      throw new Error('failed to activate');
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

bootstrap();
