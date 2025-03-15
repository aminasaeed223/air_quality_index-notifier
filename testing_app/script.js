// 

const apiKey = "68af2928-8535-4f67-b31a-b249197f12b4"; // Replace with your actual API key
let aqiChartInstance; // Store Chart.js instance

document.addEventListener("DOMContentLoaded", function () {
    const refreshButton = document.getElementById("refresh-btn");

    if (refreshButton) {
        refreshButton.addEventListener("click", fetchAQIData);
    } else {
        console.error("Refresh button not found in DOM.");
    }

    fetchAQIData(); // Initial data load
    loadAQIChart();
    loadAQITable();
});

// ✅ Request notification permission
if ("Notification" in window) {
    Notification.requestPermission();
}

// ✅ AI-based Health Recommendations
function getHealthAdvice(aqi) {
    if (aqi <= 50) return "✅ Air quality is good! Enjoy outdoor activities. 🌳";
    if (aqi <= 100) return "🟡 Moderate air quality. Sensitive individuals should take precautions.";
    if (aqi <= 150) return "🟠 Unhealthy for sensitive groups. Avoid prolonged outdoor activities.";
    if (aqi <= 200) return "🔴 Unhealthy air! Consider wearing a mask and reducing outdoor exposure.";
    if (aqi <= 300) return "🟣 Very unhealthy! Stay indoors and use air purifiers.";
    return "☠️ Hazardous! Avoid going outside at all costs. Use N95 masks if necessary.";
}

// ✅ Send Notification
function sendNotification(aqi, message) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`⚠️ Air Quality Alert: AQI ${aqi}`, {
            body: message,
            icon: "air-quality-icon.png",
        });
    }
}

// ✅ Play Alert Sound
function playAlertSound() {
    const alertSound = new Audio("alert.mp3");
    alertSound.play();
}

// ✅ Vibrate Alert (Mobile)
function vibrateAlert() {
    if (navigator.vibrate) {
        navigator.vibrate([500, 300, 500]);
    }
}

// ✅ Update AQI Display
function updateAQIDisplay(aqi) {
    const aqiElement = document.getElementById("aqi-value");
    if (aqiElement) {
        aqiElement.textContent = `AQI: ${aqi}`;
        aqiElement.className = getAQIClass(aqi);
    }
    document.getElementById("aqi-bar").value = Math.min(aqi, 300);
}

// ✅ Determine AQI Class for Color Coding
function getAQIClass(aqi) {
    if (aqi <= 50) return "good";
    if (aqi <= 100) return "moderate";
    if (aqi <= 150) return "unhealthy-sensitive";
    if (aqi <= 200) return "unhealthy";
    if (aqi <= 300) return "very-unhealthy";
    return "hazardous";
}

// ✅ Fetch AQI Data from API
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

            // Update AQI display
            updateAQIDisplay(aqi);

            // Get AI-based health advice
            const advice = getHealthAdvice(aqi);

            // Update AQI container
            let category = getAQIClass(aqi);
            aqiContainer.innerHTML = `<div class="aqi-box ${category}">AQI: ${aqi}</div>`;

            // Update weather info
            weatherInfo.innerHTML = `🌡️ Temperature: ${temp}°C | 💧 Humidity: ${humidity}% | 🌬️ Wind Speed: ${windSpeed} m/s`;

            // Show health recommendations
            healthAdvice.innerHTML = `<p>${advice}</p>`;

            console.log("AQI Data Updated:", new Date().toLocaleTimeString());

            // Send notifications and alerts if AQI is high
            if (aqi > 110) {
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

// ✅ Load AQI Trends Chart (Chart.js)
function loadAQIChart() {
    const ctx = document.getElementById("aqiChart").getContext("2d");

    if (aqiChartInstance) {
        aqiChartInstance.destroy(); // Prevent multiple instances
    }

    aqiChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                label: "AQI Trends",
                data: [50, 120, 160, 80, 100, 220, 140],
                borderColor: "white",
                borderWidth: 2,
                fill: false,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { x: { grid: { display: false } }, y: { min: 0, max: 300 } }
        }
    });
}

// ✅ Load AQI & Economic Impact Table (DataTables.js)
function loadAQITable() {
    $(document).ready(function () {
        if (!$.fn.DataTable.isDataTable("#aqiTable")) {
            $("#aqiTable").DataTable({
                data: [
                    ["New York", "120", "Moderate", "500"],
                    ["Los Angeles", "190", "Unhealthy", "1200"],
                    ["Beijing", "250", "Very Unhealthy", "3000"],
                    ["Delhi", "280", "Hazardous", "5000"]
                ],
                columns: [
                    { title: "City" },
                    { title: "AQI" },
                    { title: "Category" },
                    { title: "Economic Impact ($M)" }
                ]
            });
        }
    });
}

// ✅ Auto-update AQI data every 5 minutes (300,000 ms)
setInterval(fetchAQIData, 300000);
