export async function loadWeather() {
  try {
    //const res = await fetch('http://localhost:3000/api/weather');
    const res = await fetch('https://sports-management.azurewebsites.net/api/weather');
    const day = await res.json();

    const section = document.getElementById('weather-forecast');
    section.innerHTML = '';

    const article = document.createElement('article');

    const header = document.createElement('header');
    const heading = document.createElement('h3');
    heading.textContent = day.date;
    header.appendChild(heading);

    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = day.icon;
    img.alt = day.description;

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = `${day.condition} (${day.description})`;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    const tempParagraph = document.createElement('p');
    tempParagraph.textContent = `Temp: ${day.temp.min}°C - ${day.temp.max}°C`;

    article.appendChild(header);
    article.appendChild(figure);
    article.appendChild(tempParagraph);

    section.appendChild(article);
  } catch (error) {
    console.error('Failed to load weather:', error);
  }
}
