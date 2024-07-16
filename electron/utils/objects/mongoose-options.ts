import { Schema as mongooseSchema } from 'mongoose';

export const unRequiredString = { type: String, required: false };
export const requiredString = { ...unRequiredString, required: true };
export const uniqueRequiredString = { ...requiredString, unique: true };

export const unRequiredNumber = { type: Number, required: false };
export const requiredNumber = { ...unRequiredNumber, required: true };

export const unRequiredBoolean = { type: Boolean, required: false };
export const requiredBoolean = { ...unRequiredBoolean, required: true };

export const unRequiredDate = { type: Date, required: false };
export const requiredDate = { ...unRequiredDate, required: true };

export const unRequiredArrayOfStrings = {
  required: false,
  type: [requiredString],
};
export const requiredArrayOfString = {
  ...unRequiredArrayOfStrings,
  required: true,
};

export const unRequiredRefObjectId = {
  required: false,
  type: mongooseSchema.Types.ObjectId,
};

export const requiredRefObjectId = {
  ...unRequiredRefObjectId,
  type: mongooseSchema.Types.ObjectId,
};
