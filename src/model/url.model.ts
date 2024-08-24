import mongoose from "mongoose";

const { Schema } = mongoose;

const visitSchema = new Schema({
  clientIp: { type: String, require: true },
  timeStamp: {
    type: Date,
    default: Date.now(),
  },
  userAgent: {
    type: String,
    require: true,
  },
});

const urlSchema = new Schema(
  {
    shortCode: { type: String, require: true, unique: true },
    originalUrl: { type: String, require: true },
    totalVisits: { type: Number, default: 0 },
    uniqueVisits: { type: Number, default: 0 },
    deviceTypes: {
      desktop: { type: Number, default: 0 },
      mobile: { type: Number, default: 0 },
    },
    visitHistory: [visitSchema],
  },

  { timestamps: true }
);

const Url = mongoose.model("url", urlSchema);

export default Url;
