# AI Job Finder 🚀

This is a Flask-based web application that helps users find jobs using AI-powered search. Users can upload their CV (PDF), extract relevant skills, and search for jobs based on their skills or manually entered keywords.

## Features
- Upload CV in **PDF** format and extract keywords automatically.
- Search for jobs using **extracted keywords** or manually entered job titles.
- Fetch job listings from the **JSearch API**.
- Backend built with **Flask**, frontend with **HTML, CSS, and JavaScript**.

## Project Structure
```
AI-Job-Finder/
│── static/                # Static files (CSS, JavaScript)
│   ├── style.css        # Stylesheet for the frontend
│   ├── script.js        # JavaScript for handling uploads & job search
│── templates/             # HTML templates
│   ├── index.html         # Main frontend UI
│── uploads/               # Directory to store uploaded PDFs
│── .env                   # Environment file (not pushed to Git)
│── .gitignore             # Files to ignore in Git (includes .env)
│── app.py                 # Main Flask backend
│── requirements.txt       # Project dependencies
│── README.md              # Project documentation
```

## API Used
This project uses the **JSearch API** from RapidAPI to fetch job listings.

- **Base URL**: `https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch`
- **API Key**: Stored in the `.env` file.

## Environment Variables (.env)
Create a `.env` file in the root directory and add:

```
API=your_rapidapi_key_here
```

## Installing Dependencies
Run the following command to install required dependencies:

```
pip install -r requirements.txt
```

## Running the Project
After installing dependencies, start the Flask server with:

```
python app.py
```
