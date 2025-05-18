
function mapDataToEvents(dataArray) {
  return dataArray.map(data => ({
    title: data.title,
    start: new Date(data.start).toISOString(),
    end: new Date(data.end).toISOString(),
    extendedProps: {
      facility: data.facility,
      description: data.description
    }
  }));
}

async function fetchEvents(fetchInfo, successCallback, failureCallback) {
  try {
    const response = await fetch('https://sports-management.azurewebsites.net/api/bookings/approved');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const approvedBookings = data.filter(item => item.status === 'Approved');
    const events = mapDataToEvents(approvedBookings);
    successCallback(events);
  } 
  catch (error) {
    console.error("Error fetching calendar events:", error);
    failureCallback(error);
  }
}

function setupCalendar(calendarEl){
  const calendar = new FullCalendar.Calendar(calendarEl, {   
    events: fetchEvents,
    height: "auto",
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listWeek'
    },
    eventClick: function(info) {
      const event = info.event;
      const title = event.title;
      const facility = event.extendedProps.facility;
      const description = event.extendedProps.description;
      const start = new Date(event.start).toLocaleString();
      const end = new Date(event.end).toLocaleString();
      alert(
        `🏟️ ${title}\n` +
        `📍 Facility: ${facility}\n` +
        `📅 Start: ${start}\n` +
        `⏱️ End: ${end}\n` +
        `📝 Description: ${description || 'None'}`
      );
    }
  });
  calendar.render()
}


document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    setupCalendar(calendarEl);
})


export { mapDataToEvents, fetchEvents, setupCalendar};