const apiKey = "68af2928-8535-4f67-b31a-b249197f12b4"; // Replace with your actual API key



document.addEventListener("DOMContentLoaded", function () {
    // Ensure the script runs after the DOM is fully loaded
    const refreshButton = document.getElementById("refresh-btn");
    
    if (refreshButton) {
        refreshButton.addEventListener("click", fetchAQIData);
    } else {
        console.error("Refresh button not found in DOM.");
    }

    fetchAQIData(); // Initial data load
});

// Request notification permission
if ("Notification" in window) {
    Notification.requestPermission();
}

// Function to get AI-based health recommendations
function getHealthAdvice(aqi) {
    if (aqi <= 50) return "✅ Air quality is good! Enjoy outdoor activities. 🌳";
    if (aqi <= 100) return "🟡 Moderate air quality. Sensitive individuals should take precautions.";
    if (aqi <= 150) return "🟠 Unhealthy for sensitive groups. Avoid prolonged outdoor activities.";
    if (aqi <= 200) return "🔴 Unhealthy air! Consider wearing a mask and reducing outdoor exposure.";
    if (aqi <= 300) return "🟣 Very unhealthy! Stay indoors and use air purifiers.";
    return "☠️ Hazardous! Avoid going outside at all costs. Use N95 masks if necessary.";
}

// Function to send a notification
function sendNotification(aqi, message) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`⚠️ Air Quality Alert: AQI ${aqi}`, {
            body: message,
            icon: "air-quality-icon.png",
        });
    }
}

// Function to play an alert sound
function playAlertSound() {
    const alertSound = new Audio("alert.mp3"); // Add an alert.mp3 file in your project
    alertSound.play();
}

// Function to trigger vibration on mobile devices
function vibrateAlert() {
    if (navigator.vibrate) {
        navigator.vibrate([500, 300, 500]);
    }
}

async function fetchAQIData() {
    const url = `https://api.airvisual.com/v2/nearest_city?key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === "success") {
            const aqi = data.data.current.pollution.aqius;
            const temp = data.data.current.weather.tp;
            const humidity = data.data.current.weather.hu;
            const windSpeed = data.data.current.weather.ws;

            const aqiContainer = document.getElementById("aqi-container");
            const weatherInfo = document.getElementById("weather-info");
            const healthAdvice = document.getElementById("health-advice");

            if (!aqiContainer || !weatherInfo || !healthAdvice) {
                console.error("One or more elements not found in DOM.");
                return;
            }

            // Determine AQI category for colors
            let category = "";
            if (aqi <= 50) category = "good";
            else if (aqi <= 100) category = "moderate";
            else if (aqi <= 150) category = "unhealthy-sensitive";
            else if (aqi <= 200) category = "unhealthy";
            else if (aqi <= 300) category = "very-unhealthy";
            else category = "hazardous";

            // Get AI-based health advice
            const advice = getHealthAdvice(aqi);

            // Update AQI container
            aqiContainer.innerHTML = `<div class="aqi-box ${category}">AQI: ${aqi}</div>`;

            // Update weather info
            weatherInfo.innerHTML = `🌡️ Temperature: ${temp}°C | 💧 Humidity: ${humidity}% | 🌬️ Wind Speed: ${windSpeed} m/s`;

            // Show health recommendations
            healthAdvice.innerHTML = `<p>${advice}</p>`;

            console.log("AQI Data Updated:", new Date().toLocaleTimeString());

            // Send notifications if AQI is high
            if (aqi > 150) {
                sendNotification(aqi, "Air quality is unhealthy! Consider wearing a mask.");
                playAlertSound();
                vibrateAlert();
            }
        } else {
            console.error("API Response Error:", data);
            document.getElementById("aqi-container").innerHTML = `<p>Error fetching data</p>`;
        }
    } catch (error) {
        console.error("Error fetching AQI data:", error);
        document.getElementById("aqi-container").innerHTML = `<p>Failed to load data</p>`;
    }
}

// Auto-update AQI data every 5 minutes (300,000 ms)
setInterval(fetchAQIData, 300000);


