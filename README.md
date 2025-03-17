# 🌍 AQI Notifier

**Did you know that almost 99% of the world breathes polluted air?**

AQI Notifier is a real-time air quality monitoring app that provides air quality index (AQI) data from **10,000+ monitoring stations across 109+ countries**. With air pollution linked to **7 million deaths annually**, AQI Notifier helps users stay informed and take action to protect their health.

## Features

**Real-Time AQI Data** - Get live air quality data from thousands of monitoring stations worldwide.  
**AI-Based Health Recommendations** - Receive personalized health alerts based on AQI, temperature, humidity, and wind speed.  
**Smart Notifications** - Get notified when air quality reaches unsafe levels.  
**Historical AQI Trends** - Track air quality trends over time with interactive charts.  
**Global Coverage** - Data sourced from multiple trusted environmental monitoring agencies.  

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js
- **APIs**: AirVisual API (for AQI data)
- **AI Features**: AI-generated health alerts based on environmental conditions
- **Data Visualization**: Chart.js

## Screenshots
https://youtu.be/KpgDpbo4aOc

## Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/aqi-notifier.git
cd aqi-notifier
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Run the App
```bash
npm start
```

or, if using Vercel for local development:
```bash
npx vercel dev
```

## API Configuration
1. Get an **AirVisual API Key** from [IQAir](https://www.iqair.com/us/air-quality-monitors/api?srsltid=AfmBOopugu4LVTu4fa2ozHXdgcy74MQyyoiyYctDYXgjDfP82J8wgE_u).
2. Create a `.env` file in the root directory and add:
   ```
   AIRVISUAL_API_KEY=your_api_key_here
   ```

## How AI-Based Health Alerts Work
Our AI model analyzes:
- **AQI Levels** - Determines air quality category (Good, Moderate, Unhealthy, etc.)
- **Weather Conditions** - Includes temperature, humidity, and wind speed impact
- **Health Recommendations** - Generates alerts advising users on precautions to take

## Why This Matters
With air pollution affecting billions worldwide, our goal is to provide **actionable insights** that help people make informed decisions about their environment.

## Future Improvements
  **Predictive AQI Models** - Use machine learning to predict future AQI trends.  
  **Voice Assistant Integration** - Enable users to ask for AQI updates hands-free.  
  **Mobile App Version** - Expand to Android and iOS for greater accessibility.  

## License
This project is licensed under the **MIT License**.

## Connect With Us
We’d love to hear your feedback and ideas! Reach out to us on LinkedIn **[Calvin Ssendawula](https://www.linkedin.com/in/calvin-ssendawula-7874b0236/)**, **[Amina Saeed]()** or contribute to the repo.

---
🎉 **Check out our Hackathon submission**: [AQI Notifier on Devpost](https://devpost.com/software/aqi-notifier?ref_content=user-portfolio&ref_feature=in_progress) 🚀

