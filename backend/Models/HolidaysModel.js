import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema({
  countryCode: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  holidays: [
    {
      name: { type: String, required: true },
      date: { type: String, required: true },
    },
  ],
});

const Holiday = mongoose.model("Holiday", holidaySchema);

export default Holiday;
