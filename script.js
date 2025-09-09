// --- Get references to all our interactive elements (declared only once) ---
const calculateBtn = document.getElementById('calculateBtn');
const getLocationBtn = document.getElementById('getLocationBtn');
const fileInput = document.getElementById('safeZonesFile');
const simDateInput = document.getElementById('simDate');
const latitudeInput = document.getElementById('latitude');
const longitudeInput = document.getElementById('longitude');
const decisionSpan = document.getElementById('decision');
const scoreSpan = document.getElementById('score');
const riskMeterFill = document.getElementById('risk-meter-fill');
// This line now correctly looks for the ID 'fileName' from your HTML
const fileNameDisplay = document.getElementById('fileName'); 

// --- Event Listener to display the chosen filename ---
fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        // A file has been selected, display its name
        fileNameDisplay.textContent = fileInput.files[0].name;
    } else {
        // No file is selected, show the default text
        fileNameDisplay.textContent = 'No file chosen';
    }
});

// --- Event Listener for "Get Live Location" button ---
getLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                latitudeInput.value = lat.toFixed(4);
                longitudeInput.value = lon.toFixed(4);
                alert('Location fetched successfully!');
            },
            (error) => {
                handleLocationError(error);
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

// --- Event Listener for the main "Calculate" button ---
calculateBtn.addEventListener('click', () => {
    const simDate = simDateInput.value;
    const latitude = latitudeInput.value;
    const longitude = longitudeInput.value;
    
    if (fileInput.files.length === 0 || !simDate || !latitude || !longitude) {
        alert('Please fill in all fields and upload a safe zones file.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        try {
            const safeZonesData = JSON.parse(event.target.result);
            const payload = {
                safeZones: safeZonesData.safe_zones,
                currentLocation: { lat: parseFloat(latitude), lon: parseFloat(longitude) },
                simActivationDate: simDate
            };
            getRiskScore(payload);
        } catch (e) {
            alert('Error parsing JSON file. Please check the file format.');
        }
    };
    reader.readAsText(file);
});

// --- Function to Interact with the Backend ---
async function getRiskScore(payload) {
    decisionSpan.textContent = "Calculating...";
    scoreSpan.textContent = "---";
    riskMeterFill.style.width = '0%';
    riskMeterFill.style.backgroundColor = '#e9ecef';

    try {
        const response = await fetch('http://127.0.0.1:5000/calculateRisk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const result = await response.json();
        const score = result.riskScore;

        decisionSpan.textContent = result.decision;
        scoreSpan.textContent = score;
        riskMeterFill.style.width = `${score}%`;
        const hue = 120 - (score * 1.2);
        riskMeterFill.style.backgroundColor = `hsl(${hue}, 80%, 50%)`;

    } catch (error) {
        console.error('Error:', error);
        decisionSpan.textContent = 'Failed to connect to the backend.';
        riskMeterFill.style.backgroundColor = '#dc3545';
        riskMeterFill.style.width = '100%';
    }
}

// --- Helper function for geolocation errors ---
function handleLocationError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}