# Vacation Calendar – Data Flow

This project provides a vacation calendar where users can select a country and a year, and see all public holidays for that selection. The system uses MongoDB as a cache and Calendarific API as the holiday provider.

#  Flow

Frontend (User selects country + year)
        ⬇
Backend (Check MongoDB for existing data)
        ⬇
If Found ───────────▶ Return holidays from DB
        ⬇
If Not Found ───────▶ Call Calendarific API
        ⬇
Save new data in MongoDB
        ⬇
Return holidays to frontend
