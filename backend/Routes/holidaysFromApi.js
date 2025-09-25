import express from "express";
import Holiday from "../Models/HolidaysModel.js";

const holidaysFromApi = express.Router();

holidaysFromApi.post("/fetchHolidays", async (req, res) => {
  try {
    const { country, year } = req.body;

    if (!country || !year) {
      return res
        .status(400)
        .json({ status: "fail", message: "country and year are required" });
    }

    // 1️⃣ Check if holidays are already in MongoDB
    let holidayDoc = await Holiday.findOne({ countryCode: country, year });
    if (holidayDoc) {
      return res
        .status(200)
        .json({ status: "success", holidays: holidayDoc.holidays });
    }

    // 2️⃣ Fetch from Calendarific API
    const response = await fetch(
      `https://calendarific.com/api/v2/holidays?api_key=vkzrXsNLmhnawSRMcNJdynETNtOjebqH&country=${country}&year=${year}`
    );
    const data = await response.json();

    // 3️⃣ Filter only National holidays
    // console.log(data);
    const holidays = data.response.holidays
      .filter(
        (h) =>
          h.type.includes("National holiday") ||
          h.type.includes("Local holiday")
      )
      .map((h) => ({
        name: h.name,
        date: h.date.iso,
      }));

    // 4️⃣ Save to MongoDB for caching
    holidayDoc = new Holiday({ countryCode: country, year, holidays });
    await holidayDoc.save();

    // 5️⃣ Return response
    res.status(200).json({ status: "success", holidays });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

export default holidaysFromApi;
