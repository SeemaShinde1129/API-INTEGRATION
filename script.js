const weatherBox = document.getElementById("weatherBox");
const newsBox = document.getElementById("newsBox");



document.getElementById("weatherForm").addEventListener("submit", function (e) {
  e.preventDefault();
  openWeather();
});

document.getElementById("newsBtn").addEventListener("click", openNews);

document.getElementById("cityInput").addEventListener("input", function () {
  const resultDiv = document.getElementById("weatherResult");
  const errorDiv = document.getElementById("weatherError");

  if (this.value.trim() === "") {
    resultDiv.innerHTML = "";
    errorDiv.textContent = "";
  }
});




async function openWeather() {

 
  document.getElementById("newsContainer").innerHTML = "";
  document.getElementById("newsError").textContent = "";

  const city = document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");
  const errorDiv = document.getElementById("weatherError");

  resultDiv.innerHTML = "";
  errorDiv.textContent = "";

  if (!city) {
    errorDiv.textContent = "Please enter a city name.";
    return;
  }

  try {
    resultDiv.innerHTML = `<div class="text-gray-500">Loading weather...</div>`;

    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );
    const geoData = await geoRes.json();

    if (!geoData.results) {
      throw new Error("City not found.");
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Get Weather
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const weatherData = await weatherRes.json();

    const weather = weatherData.current_weather;

    resultDiv.innerHTML = `
      <div class="bg-blue-50 p-4 rounded-lg shadow">
        <p><strong>City:</strong> ${name}, ${country}</p>
        <p><strong>Temperature:</strong> ${weather.temperature} °C</p>
        <p><strong>Wind Speed:</strong> ${weather.windspeed} km/h</p>
      </div>
    `;

  } catch (error) {
    resultDiv.innerHTML = "";
    errorDiv.textContent = error.message;
  }
}



async function openNews() {

  document.getElementById("weatherResult").innerHTML = "";
  document.getElementById("weatherError").textContent = "";

  const container = document.getElementById("newsContainer");
  const errorDiv = document.getElementById("newsError");

  container.innerHTML = "";
  errorDiv.textContent = "";

  try {
    container.innerHTML = `
      <div class="text-gray-500 text-center">Loading news...</div>
    `;

    const response = await fetch(
      "https://api.spaceflightnewsapi.net/v4/articles/?limit=20"
    );

    if (!response.ok) {
      throw new Error("Network error.");
    }

    const data = await response.json();

    const shuffled = data.results.sort(() => 0.5 - Math.random());

    const randomFive = shuffled.slice(0, 5);

    container.innerHTML = "";

    randomFive.forEach(article => {
      container.innerHTML += `
        <div class="bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition">
          <img src="${article.image_url}" 
               class="rounded-lg mb-3 w-full h-40 object-cover"
               alt="news image">
          <h3 class="font-semibold text-lg mb-2">${article.title}</h3>
          <p class="text-sm text-gray-500 mb-2">${article.news_site}</p>
          <a href="${article.url}" target="_blank"
             class="text-blue-500 hover:underline text-sm">
             Read More →
          </a>
        </div>
      `;
    });

  } catch (error) {
    container.innerHTML = "";
    errorDiv.textContent = "Unable to load news. Please try again.";
  }

}
