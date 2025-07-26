document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const resumeForm = document.getElementById("resume-form");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const btnSpinner = analyzeBtn.querySelector(".spinner-border");
    const btnText = document.getElementById("btn-text");
    const resultsSection = document.getElementById("results");
    const scoreChartCanvas = document.getElementById("scoreChart");
    const keywordAnalysisDiv = document.getElementById("keyword-analysis");
    const feedbackAccordion = document.getElementById("feedback-accordion");

    let scoreChart = null; // To hold the chart instance

    // Handle form submission
    resumeForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent actual form submission

        // --- 1. Show Loading State ---
        btnText.textContent = "Analyzing...";
        btnSpinner.classList.remove("d-none");
        analyzeBtn.disabled = true;

        // --- 2. Simulate AI Analysis (replace with actual API call) ---
        // For a hackathon, simulating the delay is a great way to demo the flow.
        setTimeout(() => {
            // --- 3. Generate Mock Results ---
            const mockResults = generateMockData();

            // --- 4. Display Results ---
            displayResults(mockResults);

            // --- 5. Reset Button and Scroll to Results ---
            btnText.textContent = "Analyze My Resume";
            btnSpinner.classList.add("d-none");
            analyzeBtn.disabled = false;

            resultsSection.classList.remove("d-none");
            resultsSection.scrollIntoView({ behavior: "smooth" });

        }, 3000); // 3-second delay
    });

    /**
     * Generates fake data to display in the dashboard.
     * In a real app, this would come from your AI backend.
     */
    function generateMockData() {
        return {
            overallScore: Math.floor(Math.random() * 40) + 60, // Score between 60 and 100
            keywords: {
                matching: ["Project Management", "Agile", "Scrum", "Stakeholder Communication", "Budgeting"],
                missing: ["Risk Analysis", "JIRA", "CI/CD"]
            },
            feedback: [
                { title: "Impact & Action Verbs", content: "Your resume is strong but could be improved by replacing passive phrases like 'responsible for' with powerful action verbs such as 'Orchestrated', 'Engineered', or 'Spearheaded' to better showcase your achievements." },
                { title: "Quantifiable Metrics", content: "Add more quantifiable results. For example, instead of 'Improved team efficiency', write 'Increased team efficiency by 15% by implementing a new Agile workflow'." },
                { title: "Formatting & Readability", content: "The resume format is clean and ATS-friendly. The font size is appropriate and section headers are clear. No immediate changes needed here." }
            ]
        };
    }

    /**
     * Renders the analysis results on the page.
     * @param {object} data The analysis data.
     */
    function displayResults(data) {
        // --- Display Score Chart ---
        if (scoreChart) {
            scoreChart.destroy(); // Clear previous chart if it exists
        }
        scoreChart = new Chart(scoreChartCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Your Score', ''],
                datasets: [{
                    label: 'Overall Score',
                    data: [data.overallScore, 100 - data.overallScore],
                    backgroundColor: ['#0d6efd', '#e9ecef'],
                    borderColor: ['#ffffff'],
                    borderWidth: 4,
                    circumference: 180, // Make it a semi-circle
                    rotation: 270,      // Start from the bottom
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                cutout: '70%' // Controls the thickness of the doughnut
            }
        });
        
        // Add text in the middle of the chart
        const chartCenterText = document.createElement('div');
        chartCenterText.style.position = 'absolute';
        chartCenterText.style.top = '60%';
        chartCenterText.style.left = '50%';
        chartCenterText.style.transform = 'translate(-50%, -50%)';
        chartCenterText.style.textAlign = 'center';
        chartCenterText.innerHTML = `<strong class="display-5">${data.overallScore}%</strong>`;
        scoreChartCanvas.parentNode.style.position = 'relative';
        // Clear previous text if any
        if(scoreChartCanvas.parentNode.querySelector('div')) {
           scoreChartCanvas.parentNode.querySelector('div').remove();
        }
        scoreChartCanvas.parentNode.appendChild(chartCenterText);


        // --- Display Keyword Analysis ---
        keywordAnalysisDiv.innerHTML = `
            <h6><i class="fa-solid fa-check-circle text-success"></i> Matching Keywords</h6>
            <div class="mb-3">
                ${data.keywords.matching.map(kw => `<span class="badge bg-success me-1 mb-1">${kw}</span>`).join('')}
            </div>
            <h6><i class="fa-solid fa-times-circle text-danger"></i> Missing Keywords</h6>
            <div>
                ${data.keywords.missing.map(kw => `<span class="badge bg-warning text-dark me-1 mb-1">${kw}</span>`).join('')}
            </div>
        `;

        // --- Display Actionable Feedback ---
        feedbackAccordion.innerHTML = data.feedback.map((item, index) => `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading-${index}">
                    <button class="accordion-button ${index > 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${index}">
                        ${item.title}
                    </button>
                </h2>
                <div id="collapse-${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" data-bs-parent="#feedback-accordion">
                    <div class="accordion-body">
                        ${item.content}
                    </div>
                </div>
            </div>
        `).join('');
    }
});