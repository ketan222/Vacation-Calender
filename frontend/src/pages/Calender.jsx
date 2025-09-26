import { useState, useEffect } from "react";
// Utility to generate days of a month
function getMonthDays(year, month) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

// Countries list (avl in the calendarific api)
const countries = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "BR", name: "Brazil" },
  { code: "ZA", name: "South Africa" },
  { code: "RU", name: "Russia" },
  { code: "MX", name: "Mexico" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "NZ", name: "New Zealand" },
  { code: "SE", name: "Sweden" },
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Calender() {
  const [country, setCountry] = useState("US");
  // const [countries, setCountries] = useState([]);
  const [year, setYear] = useState(2025);
  const [vacationModeON, setVacationModeON] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("monthly");

  // useEffect(() => {
  //   fetch(
  //     `https://calendarific.com/api/v2/countries?api_key=vkzrXsNLmhnawSRMcNJdynETNtOjebqH`
  //   )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const list = data.response.countries.map((c) => ({
  //         code: c["iso-3166"],
  //         name: c.country_name,
  //         flag: c.flag_unicode,
  //       }));
  //       setCountries(list);
  //     })
  //     .catch((err) => console.error("Error fetching countries:", err));
  // }, []);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/fetchFrom/fetchHolidays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country, year }),
    })
      .then((res) => res.json())
      .then((data) => setHolidays(data.holidays || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [country, year]);

  function isHoliday(date) {
    /*
    {
      "name": "Republic Day",
      "date": "2019-01-26"
      }
    console.log(holidays[0] + "++++++++++++");         
    */

    for (let i = 0; i < holidays.length; i++) {
      // console.log(date);
      const hDate = new Date(holidays[i].date);
      if (hDate.toDateString() === date.toDateString()) return holidays[i];
    }
    return null;
  }

  function isHolidayInWeek(week) {
    for (let i = 0; i < week.length; i++) {
      if (week[i] && isHoliday(week[i])) return true;
    }
    return false;
  }

  function chkConsecutiveHolidays(week) {
    let a = week[0];
    for (let i = 1; i < week.length; i++) {
      if (a && isHoliday(a) && isHoliday(week[i])) return true;
      a = week[i];
    }
    return false;
  }

  function renderMonthGrid(month) {
    const days = getMonthDays(year, month);
    const startDay = days[0].getDay();
    const paddedDays = [];
    for (let i = 0; i < startDay; i++) paddedDays.push(null);
    for (let i = 0; i < days.length; i++) paddedDays.push(days[i]);

    const weeks = [];
    for (let i = 0; i < paddedDays.length; i += 7) {
      weeks.push(paddedDays.slice(i, i + 7));
    }

    return (
      <div>
        <div className="grid grid-cols-7 text-center font-medium text-gray-500 mb-2 ">
          {dayNames.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {weeks.map((week, idx) => {
          let holidayCount = 0;
          for (let d = 0; d < week.length; d++) {
            if (week[d] && isHoliday(week[d])) holidayCount++;
          }
          let bgColor = "bg-white";
          console.log(chkConsecutiveHolidays(week));
          if (holidayCount === 1) bgColor = "bg-green-200";
          else if (chkConsecutiveHolidays(week)) {
            // console.log("here");
            bgColor = "bg-amber-400";
          } else if (holidayCount >= 2) bgColor = "bg-green-400";
          if (vacationModeON && !isHolidayInWeek(week)) return;
          return (
            <div
              key={idx}
              className={
                "grid grid-cols-7 gap-2  mb-2 p-2 rounded-xl transition-colors duration-300 " +
                bgColor
              }
            >
              {week.map((day, index) => {
                if (!day) return <div key={index}></div>;
                const holiday = isHoliday(day);
                return (
                  <div
                    key={day.toDateString()}
                    className={
                      "group flex flex-col items-center px-1 text-xs justify-center rounded-xl cursor-pointer border shadow w-[90%] hover:scale-105 transform transition duration-200 " +
                      (holiday
                        ? "bg-red-500 text-white font-bold shadow-lg"
                        : "bg-white") +
                      (view === "quarterly" ? " h-10" : " h-16")
                    }
                    // for the pop name (tooltip)
                    title={holiday ? holiday.name : ""}
                  >
                    {/* Show date normally, hide on hover if holiday */}
                    <span
                      className={
                        holiday && view === "monthly"
                          ? "group-hover:hidden"
                          : ""
                      }
                    >
                      {day.getDate()}
                    </span>

                    {/* Show holiday name only on hover in monthly view */}
                    {holiday && view === "monthly" && (
                      <span className="hidden group-hover:block text-xs mt-1 text-bol text-white font-semibold text-center">
                        {holiday.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  function renderMonth(month) {
    return (
      <div
        key={month}
        className="mb-6 p-4 rounded-2xl shadow-lg bg-gradient-to-b from-white to-pink-50 "
      >
        <h3 className="text-xl font-bold mb-3 text-center text-gray-800">
          {new Date(year, month).toLocaleString("default", { month: "long" })}
        </h3>
        {renderMonthGrid(month)}
      </div>
    );
  }

  function renderQuarter(quarter, quarterIndex) {
    // console.log(quarter + " " + quarterIndex);
    return (
      <div
        key={quarterIndex}
        className="mb-8 md:mb-12 border-2 border-gray-500 py-4 md:py-7 rounded-xl shadow-md shadow-gray-500"
      >
        <h2 className="text-4xl font-extrabold mb-6 text-center text-purple-700">
          Quarter {quarterIndex + 1}
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {quarter.map((month) => (
            <div
              key={month}
              className="min-w-[360px] md:w-[380px] p-4 rounded-3xl shadow-2xl bg-gradient-to-b from-white to-purple-50 hover:scale-101 transform transition duration-300"
            >
              <h3 className="text-xl font-bold mb-3 text-center text-gray-800">
                {new Date(year, month).toLocaleString("default", {
                  month: "long",
                })}{" "}
              </h3>
              {renderMonthGrid(month)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const months = [];
  for (let i = 0; i < 12; i++) months.push(i);

  const quarters = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [9, 10, 11],
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8">
      {/* Sidebar for buttons */}
      <div className="flex flex-col gap-8 w-80 p-6 rounded-3xl shadow-2xl bg-white sticky top-8 h-fit">
        <h2 className="text-3xl font-extrabold text-gray-700 mb-6 text-center">
          Controls
        </h2>

        <div className="flex flex-col gap-4">
          <label className="font-bold text-gray-700 text-lg">Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border px-6 py-3 rounded-3xl shadow-xl hover:shadow-2xl transition text-lg font-bold"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-bold text-gray-700 text-lg">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="border px-6 py-3 rounded-3xl shadow-xl hover:shadow-2xl transition text-lg font-bold"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-bold text-gray-700 text-lg">View</label>
          <div className="flex gap-4">
            <button
              onClick={() => setView("monthly")}
              className={
                "px-8 py-1 rounded-3xl shadow-xl transition text-lg font-extrabold " +
                (view === "monthly"
                  ? "bg-green-300 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200")
              }
            >
              Monthly
            </button>
            <button
              onClick={() => setView("quarterly")}
              className={
                "px-8 py-4 rounded-3xl shadow-xl transition text-lg font-extrabold " +
                (view === "quarterly"
                  ? "bg-green-300 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200")
              }
            >
              Quarterly
            </button>
          </div>
        </div>

        <div className="mt-2">
          <div
            onClick={() => {
              setVacationModeON((prev) => !prev);
            }}
            className={`mb-5 px-8 py-4 rounded-3xl shadow-xl transition text-lg font-extrabold ${
              vacationModeON
                ? "bg-green-300 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Vacation Mode
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-xl shadow-lg"></div>
              <span className="text-gray-700 font-semibold">Holiday</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-200 rounded-xl shadow-sm border"></div>
              <span className="text-gray-700 font-semibold">
                Week with 1 holiday
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-400 rounded-xl shadow-sm border"></div>
              <span className="text-gray-700 font-semibold">
                Week with ≥2 holidays
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 ml-10 overflow-y-auto">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-gray-800">
          Vacation Calendar
        </h1>
        {loading ? (
          <p className="text-center text-gray-600 text-lg">
            Loading holidays...
          </p>
        ) : view === "monthly" ? (
          months.map(renderMonth)
        ) : (
          quarters.map((q, idx) => renderQuarter(q, idx))
        )}
      </div>
    </div>
  );
}
