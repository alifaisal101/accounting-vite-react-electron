import { Schema, model } from 'mongoose';

// Document interface
interface Inital {
  define: string;
  key?: string;
  data?: Buffer;
}

// Schema
const schema = new Schema<Inital>({
  define: { type: String, required: true, unique: true },
  key: { type: String, required: false },
  data: { type: Buffer, required: false },
});

const InitalModel = model('Inital', schema);
export default InitalModel;
