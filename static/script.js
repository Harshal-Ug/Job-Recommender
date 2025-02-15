let extractedKeywords = "";

// Toggle Input for Manual vs. CV Search
function toggleInput(isManual) {
    const keywordInput = document.getElementById("keywords");
    keywordInput.disabled = !isManual;
    keywordInput.placeholder = isManual ? "Enter job title (e.g., Data Scientist)" : "Using Extracted CV Keywords";
}

// CV Upload Function (Triggers on Button Click)
document.getElementById("upload-btn").addEventListener("click", async function () {
    const fileInput = document.getElementById("cvUpload");
    
    if (fileInput.files.length === 0) {
        alert("Please select a PDF CV before uploading.");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("cv", file);

    try {
        document.getElementById("upload-text").innerText = "Uploading...";

        const response = await fetch("http://127.0.0.1:5000/upload-cv", {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();

        if (data.cv_keywords) {
            extractedKeywords = data.cv_keywords;
            document.getElementById("cv-keywords").innerText = "Extracted Skills: " + extractedKeywords;
            document.getElementById("upload-text").innerText = "✅ CV Uploaded Successfully!";
        } else {
            document.getElementById("upload-text").innerText = "⚠️ Failed to Extract Skills.";
        }
    } catch (error) {
        console.error("Upload Error:", error);
        document.getElementById("upload-text").innerText = "⚠️ Upload Failed. Try Again.";
    }
});

// Fetch Jobs Function
async function fetchJobs() {
    const useCVKeywords = document.getElementById("cvInput").checked;
    const keywordsInput = document.getElementById("keywords").value.trim();
    const keywords = useCVKeywords ? extractedKeywords : keywordsInput;

    const location = document.getElementById("location").value.trim();
    if (!location) {
        alert("Please enter a location.");
        return;
    }

    if (!keywords) {
        alert("Please enter a job title or upload a CV.");
        return;
    }

    const url = `http://127.0.0.1:5000/jobs?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}`;
    const resultsDiv = document.getElementById("job-results");

    try {
        resultsDiv.innerHTML = `<p>🔍 Searching for "${keywords}" jobs in ${location}...</p>`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        resultsDiv.innerHTML = "";  // Clear previous results

        if (!data.data || data.data.length === 0) {
            resultsDiv.innerHTML = "<p>❌ No jobs found.</p>";
            return;
        }

        let html = "<h3>✅ Job Results</h3>";
        data.data.slice(0, 10).forEach(job => {
            html += `
                <div class="job-card">
                    <p><strong>${job.job_title}</strong> at ${job.employer_name}</p>
                    <p>📍 ${job.job_city}, ${job.job_country}</p>
                    <p><a href="${job.job_apply_link}" target="_blank">🔗 Apply Now</a></p>
                </div>
            `;
        });

        resultsDiv.innerHTML = html;

    } catch (error) {
        console.error("Job Search Error:", error);
        resultsDiv.innerHTML = "<p>⚠️ Error fetching jobs. Please try again.</p>";
    }
}
