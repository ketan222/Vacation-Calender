# Vacation Calendar – Data Flow

This project provides a vacation calendar where users can select a country and a year, and see all public holidays for that selection. The system uses MongoDB as a cache and Calendarific API as the holiday provider.

Data Flow

User Input

On the frontend, the user selects a country and enters a year.

Example: country = "IN", year = 2025.

API Request to Backend

The frontend sends a POST request to the backend endpoint:

/api/fetchFrom/fetchHolidays


with body:

{
  "country": "IN",
  "year": 2025
}


Check MongoDB (Cache Layer)

The backend first checks MongoDB to see if holidays for the given country and year already exist.

If found → return holidays directly from MongoDB (faster, no external API call).

Fetch from Calendarific API (if not in DB)

If the holidays are not in MongoDB, the backend makes an external API call to Calendarific with the provided country and year.

Calendarific responds with holiday data in JSON format.

Store in MongoDB

The fetched holiday data is stored in MongoDB for future requests.

This ensures subsequent requests for the same country + year are served directly from the DB without hitting Calendarific again.

Return Response to Frontend

The backend sends the final holiday list (either from MongoDB or Calendarific) back to the frontend.

The frontend then renders the holidays in the monthly or quarterly calendar view.
