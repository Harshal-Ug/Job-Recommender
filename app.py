from flask import Flask, request, jsonify, render_template
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pdfminer.high_level import extract_text  # PDFMiner for extracting text

load_dotenv("api.env")
JSEARCH_API_KEY = os.getenv("API")

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access
@app.route('/')
def home():
    return render_template("index.html")
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# RapidAPI JSearch API Key
# JSEARCH_API_KEY = ""  

# Function to extract keywords from CV text
def extract_keywords(cv_text):
    words = cv_text.lower().split()
    important_keywords = ["developer", "python", "java", "engineer", "data", "analyst", "manager", "sql"]
    matched_keywords = [word for word in words if word in important_keywords]
    return " ".join(set(matched_keywords)) if matched_keywords else "software developer"

@app.route('/upload-cv', methods=['POST'])
def upload_cv():
    if "cv" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["cv"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not file.filename.endswith(".pdf"):
        return jsonify({"error": "Invalid file format. Only PDFs are supported."}), 400

    # Save PDF locally
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], secure_filename(file.filename))
    file.save(filepath)

    # Extract text using PDFMiner
    try:
        cv_text = extract_text(filepath).strip()
        # print("Extracted CV Text:", cv_text)  # Debugging: Print extracted text
    except Exception as e:
        return jsonify({"error": "Failed to extract text from PDF", "details": str(e)}), 500

    if not cv_text:
        return jsonify({"cv_keywords": "software developer", "message": "No text found in PDF, using default keywords."})

    extracted_keywords = extract_keywords(cv_text)
    return jsonify({"cv_keywords": extracted_keywords})

@app.route('/jobs', methods=['GET'])
def get_jobs():
    keywords = request.args.get('keywords', 'developer')
    location = request.args.get('location', 'India')

    url = "https://jsearch.p.rapidapi.com/search"
    headers = {
        "X-RapidAPI-Key": JSEARCH_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }
    params = {
        "query": f"{keywords} jobs in {location}",
        "page": "1",
        "num_pages": "1",
        "country": "in",
        "date_posted": "all"
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        return jsonify(response.json())  
    else:
        return jsonify({"error": "Failed to fetch jobs", "status": response.status_code}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)
