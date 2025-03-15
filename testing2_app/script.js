const apiKey = "68af2928-8535-4f67-b31a-b249197f12b4";
let aqiChartInstance;

document.addEventListener("DOMContentLoaded", function () {
    const refreshButton = document.getElementById("refresh-btn");

    if (refreshButton) {
        refreshButton.addEventListener("click", () => {
            refreshButton.classList.add('refreshing');
            fetchAQIData();
            setTimeout(() => refreshButton.classList.remove('refreshing'), 1000);
        });
    }

    initializeApp();
});

async function initializeApp() {
    await requestNotificationPermission();
    await fetchAQIData();
    loadAQIChart();
    loadAQITable();
}

// Request permission for browser notifications
async function requestNotificationPermission() {
    if ("Notification" in window) {
        try {
            const permission = await Notification.requestPermission();
            console.log("Notification permission:", permission);
        } catch (error) {
            console.error("Error requesting notification permission:", error);
        }
    }
}

function getHealthAdvice(aqi) {
    const advices = {
        50: { message: "✅ Air quality is excellent! Perfect for outdoor activities.", icon: "🌳" },
        100: { message: "🟡 Moderate air quality. Sensitive individuals should take precautions.", icon: "⚠️" },
        150: { message: "🟠 Unhealthy for sensitive groups. Limit outdoor exposure.", icon: "😷" },
        200: { message: "🔴 Unhealthy air! Wear masks and reduce outdoor activities.", icon: "🏠" },
        300: { message: "🟣 Very unhealthy! Stay indoors and use air purifiers.", icon: "⛔" },
        1000: { message: "☠️ Hazardous! Avoid outdoor activities completely.", icon: "🚫" }
    };

    for (let threshold of Object.keys(advices).sort((a, b) => a - b)) {
        if (aqi <= threshold) {
            return `${advices[threshold].icon} ${advices[threshold].message}`;
        }
    }
}

// Send a notification for bad air quality
function sendNotification(aqi, message) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`Air Quality Alert: AQI ${aqi}`, {
            body: message,
            icon: "https://img.icons8.com/color/96/000000/air-quality.png"
        });
    }
}

// Update weather info
function updateWeatherDisplay(temp, humidity, windSpeed) {
    document.getElementById('temperature').textContent = `${temp}°C`;
    document.getElementById('humidity').textContent = `${humidity}%`;
    document.getElementById('wind-speed').textContent = `${windSpeed} m/s`;
}

// Fetch AQI data
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

            updateAQIDisplay(aqi);
            updateWeatherDisplay(temp, humidity, windSpeed);

            const advice = getHealthAdvice(aqi);
            document.getElementById("health-advice").innerHTML = `<p>${advice}</p>`;

            if (aqi > 110) {
                sendNotification(aqi, "Air quality is unhealthy! Take precautions.");
            }

            updateChart(aqi);
        } else {
            console.error("API Response Error:", data);
            showError("Error fetching AQI data");
        }
    } catch (error) {
        console.error("Error fetching AQI data:", error);
        showError("Failed to load AQI data");
    }
}

// Display AQI
function updateAQIDisplay(aqi) {
    const aqiElement = document.getElementById("aqi-value");
    const aqiBar = document.getElementById("aqi-bar");

    if (aqiElement && aqiBar) {
        aqiElement.textContent = aqi;
        aqiElement.className = `aqi-display ${getAQIClass(aqi)}`;
        aqiBar.value = Math.min(aqi, 300);

        aqiElement.classList.add('update-animation');
        setTimeout(() => aqiElement.classList.remove('update-animation'), 500);
    }
}

// Determine AQI category
function getAQIClass(aqi) {
    if (aqi <= 50) return "good";
    if (aqi <= 100) return "moderate";
    if (aqi <= 150) return "unhealthy-sensitive";
    if (aqi <= 200) return "unhealthy";
    if (aqi <= 300) return "very-unhealthy";
    return "hazardous";
}

// Load AQI chart
function loadAQIChart() {
    const ctx = document.getElementById("aqiChart").getContext("2d");

    if (aqiChartInstance) {
        aqiChartInstance.destroy();
    }

    aqiChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return d.toLocaleDateString('en-US', { weekday: 'short' });
            }),
            datasets: [{
                label: "AQI Trends",
                data: [50, 120, 160, 80, 100, 220, 140],
                borderColor: "#00b4db",
                backgroundColor: "rgba(0, 180, 219, 0.1)",
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#fff",
                pointBorderColor: "#00b4db",
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { ticks: { color: "#8b97a5" } },
                y: { min: 0, max: 300, ticks: { color: "#8b97a5" } }
            }
        }
    });
}

// Update chart with new data
function updateChart(newAQI) {
    if (aqiChartInstance) {
        const data = aqiChartInstance.data.datasets[0].data;
        data.shift();
        data.push(newAQI);
        aqiChartInstance.update();
    }
}

// Load AQI Table
function loadAQITable() {
    $(document).ready(function () {
        if (!$.fn.DataTable.isDataTable("#aqiTable")) {
            $("#aqiTable").DataTable({
                data: [
                    ["New York", "120", "Moderate", "500"],
                    ["Los Angeles", "190", "Unhealthy", "1200"],
                    ["Beijing", "250", "Very Unhealthy", "3000"],
                    ["Delhi", "280", "Hazardous", "5000"],
                    ["London", "85", "Moderate", "300"],
                    ["Tokyo", "145", "Unhealthy for Sensitive Groups", "800"]
                ],
                columns: [
                    { title: "City" },
                    { title: "AQI" },
                    { title: "Category" },
                    { title: "Economic Impact ($M)" }
                ],
                pageLength: 5,
                order: [[1, "desc"]],
                responsive: true
            });
        }
    });
}

// Auto-refresh AQI data every 5 minutes
setInterval(() => {
    console.log("Fetching AQI data...");
    fetchAQIData();
}, 300000);
