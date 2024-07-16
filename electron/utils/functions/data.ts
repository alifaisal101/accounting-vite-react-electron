export const arrayBufferToJson = (arrayBuffer: ArrayBuffer) => {
  const uint8Array = new Uint8Array(arrayBuffer);
  const array = Array.from(uint8Array);
  const object = {
    data: array,
  };
  const json = JSON.stringify(object);
  return json;
};

export const jsonToBuffer = (json: string) => {
  const object = JSON.parse(json);
  const buffer = Buffer.from(object.data);
  return buffer;
};

export const jsonToBase64Url = (json: string) => {
  const object = JSON.parse(json);
  const typedArray = object.data;
  const stringChar = typedArray.reduce((data: any, byte: any) => {
    return data + String.fromCharCode(byte);
  }, '');

  const base64String = btoa(stringChar);
  const imageUrl = `data:image/jpg;base64, ` + base64String;
  return imageUrl;
};

// Convert Mongo's Object ID from an Object to a string, in all records in an array
export const convertIdInRecords = (records: Array<any>) => {
  return records.map((record) => {
    record._id = record._id.toString();
    return record;
  });
};
