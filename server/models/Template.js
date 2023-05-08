import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  template: {
    type: Buffer,
    required: true,
  },
});

const Template = mongoose.model("Template", certificateSchema);

export default Template;
