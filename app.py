# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import fitz  # This is PyMuPDF

# Initialize the Flask app
app = Flask(__name__)
# This is crucial to allow your frontend to talk to your backend
CORS(app)  

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    """
    This endpoint receives a resume file and a job description,
    analyzes them, and returns a JSON response.
    """
    # 1. Get the data from the request
    if 'resumeFile' not in request.files:
        return jsonify({'error': 'No resume file found'}), 400
    
    resume_file = request.files['resumeFile']
    job_description = request.form.get('jobDescription', '')

    # 2. Extract text from the PDF resume
    try:
        doc = fitz.open(stream=resume_file.read(), filetype="pdf")
        resume_text = ""
        for page in doc:
            resume_text += page.get_text()
        doc.close()
    except Exception as e:
        return jsonify({'error': f'Error reading PDF file: {e}'}), 500

    # 3. **AI LOGIC GOES HERE** (Using mock data for the demo)
    # Simple Keyword Analysis (example)
    jd_words = set(job_description.lower().split())
    resume_words = set(resume_text.lower().split())
    
    # Remove common small words to improve quality
    common_words_to_ignore = {'a', 'an', 'the', 'in', 'on', 'for', 'with', 'is', 'of', 'to', 'and'}
    jd_keywords = jd_words - common_words_to_ignore
    
    matching_keywords = list(jd_keywords.intersection(resume_words))
    
    analysis_result = {
        "overallScore": min(95, 60 + len(matching_keywords) * 5),  # Calculated score
        "keywords": {
            "matching": matching_keywords[:10], # Show first 10 matches
            "missing": list(jd_keywords - resume_words)[:5] # Show first 5 missing keywords
        },
        "feedback": [
            { "title": "Real-time Feedback", "content": "This feedback came directly from the Python backend!" },
            { "title": "File Content Length", "content": f"The resume contains {len(resume_text)} characters."}
        ],
        "careerPaths": [
            { "title": "DevOps Engineer", "description": "Your skills in automation and cloud infrastructure make you a strong candidate for a DevOps role. Focus on learning CI/CD tools like Jenkins or GitLab." },
            { "title": "Data Scientist", "description": "With a background in Python and analytics, consider a career in Data Science. Enhancing your SQL and statistical modeling skills would be beneficial." }
        ]
    }

    # 4. Return the result as JSON
    return jsonify(analysis_result)

# This allows you to run the app directly on your computer for testing
if __name__ == '__main__':
    app.run(debug=True)