import PrintSettingsModel, { InPrintSettings } from '../models/printsettings';
import { arrayBufferToJson, jsonToBuffer } from '../utils/functions/data';

export const savePrintSettings = async (
  printsettings_data: InPrintSettings
) => {
  if (printsettings_data.image) {
    // @ts-ignore
    printsettings_data.image = jsonToBuffer(printsettings_data.image);
  }
  const result = await PrintSettingsModel.findOneAndUpdate(
    {},
    printsettings_data,
    { upsert: true, new: true }
  );

  //@ts-ignore
  const printSettings = result._doc;
  printSettings._id = result._id.toString();
  if (printSettings.image) {
    printSettings.image = arrayBufferToJson(printSettings.image);
  }

  return result;
};

export const getPrintSettings = async () => {
  const result = await PrintSettingsModel.findOne();

  let printSettings = {};
  if (result) {
    //@ts-ignore
    printSettings = result._doc;
    //@ts-ignore
    printSettings._id = result._id.toString();

    if (result.image) {
      //@ts-ignore
      printSettings.image = arrayBufferToJson(printSettings.image);
    }
  }

  return printSettings;
};
