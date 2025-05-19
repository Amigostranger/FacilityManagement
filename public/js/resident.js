const reportBtn=document.getElementById('reportBtn');
const notificationBtn = document.getElementById('notificationBtn');
const notificationImg = document.getElementById("notify");


reportBtn.addEventListener('click',async(e)=>{
    e.preventDefault();  
    window.location.href = "./resident_report_issue.html";
});

notificationBtn.addEventListener('click',async(e)=>{
    e.preventDefault();
    window.location.href="./resident_notifications.html"

});

const bookingsBtn=document.getElementById('bookingsBtn');
bookingsBtn.addEventListener('click',async(e)=>{
    e.preventDefault();
    window.location.href = "./resident_new_booking.html"; 
});

const counter = document.getElementById('counter');

bookingsBtn.addEventListener('click',async(e)=>{
    e.preventDefault();
    window.location.href = "./resident_new_booking.html"; 
});



// Add the 'shake' class to trigger the animation
notificationImg.classList.add("shake");

// Remove the class after animation ends so it can be triggered again later
notificationImg.addEventListener("animationend", () => {
    notificationImg.classList.remove("shake");
  });

async function loadWeather() {
  try {
    const res = await fetch('http://localhost:3000/api/weather');
    const day = await res.json(); // Single object now

    const section = document.getElementById('weather-forecast');
    section.innerHTML = ''; // Clear old content if any

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

window.addEventListener('DOMContentLoaded', loadWeather);

