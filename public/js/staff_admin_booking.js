
// Elements
const bookingsTableBody = document.querySelector('#bookingsTable tbody');
const bookingModal = document.getElementById('bookingModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalFacility = document.getElementById('modalFacility');
const modalStart = document.getElementById('modalStart');
const modalEnd = document.getElementById('modalEnd');
const statusSelect = document.getElementById('statusSelect');
const saveStatusBtn = document.getElementById('saveStatusBtn');
const cancelBtn = document.getElementById('cancelBtn');
const sec=document.getElementById("drop");
let selectedBookingId = "";


async function getuser(id) {
  console.log(id);
  
  const response=await fetch(`https://sports-management.azurewebsites.net/api/get-users`);
  const data = await response.json();
  const spec = data.find(u => u.id === id);
  console.log(spec.username);
  
  return spec.username;
}
async function loadBookings() {
    bookingsTableBody.innerHTML = "";
    bookingModal.hidden = true;
    const bookings=await fetch("https://sports-management.azurewebsites.net/api/staff-bookings");
    const data = await bookings.json();
    let bookarr = [];


    if(data){
      bookarr = data;
    }

    for (const book of bookarr) {
      const user = await getuser(book.submittedBy);
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user || "N/A"}</td>
        <td>${book.title || "None"}</td>
        <td>
          <button class="viewBtn" data-id="${book.bookId}">View</button>
        </td>
      `;
      bookingsTableBody.appendChild(row);
    }
    


   attachListeners(bookarr);


}


function attachListeners(bookarr) {
  document.querySelectorAll('.viewBtn').forEach(btn=>{
    btn.addEventListener('click', (event) => view(event, bookarr));
    console.log("attached listeners");
    
  })

}
  function view(event,bookarr){
    bookingModal.hidden = false;
    const bookidd=event.target.getAttribute('data-id');
    const specificBooking = bookarr.find(booking => booking.bookId === bookidd);
    modalTitle.textContent=specificBooking.Title;
    modalDescription.textContent=specificBooking.Description;

    modalStart.textContent=specificBooking.start;
    modalEnd.textContent=specificBooking.end;
    modalFacility.textContent=specificBooking.facility;
    sec.innerHTML = ""; 


    const dropdown = document.createElement('select');
    dropdown.className = 'bookselector'; 
    dropdown.setAttribute('data-id', bookidd);  
  const defaultOption = document.createElement('option');
  defaultOption.value = "";
  defaultOption.textContent = "-- Select --";
  dropdown.appendChild(defaultOption);



  ["in Progress", "Approve", "Decline"].forEach(state => {
    const option = document.createElement('option');
    option.value = state;
    option.textContent = state;
    dropdown.appendChild(option);
});
dropdown.addEventListener('change',()=>{
  selectedBookingId=bookidd;
})
 
sec.appendChild(dropdown);

  
  }


saveStatusBtn.addEventListener("click",async ()=>{
    const dropdown = sec.querySelector('select');
    const newStatus = dropdown.value;
    bookingModal.hidden = true;

    if (newStatus) {
      await updateStatus(selectedBookingId, newStatus);
      bookingModal.hidden = true;
    } else {
      console.error('No status selected');
    }
    
  })
  cancelBtn.addEventListener("click",()=>{
    bookingModal.hidden = true;
  })



// async function status(event){


//   const bookId = event.target.getAttribute('data-id');
//   const newStatus = event.target.value;

//   const it =await saveStatusBtn.clicked;
//   const sendIT=await fetch(`http://localhost:3000/api/booking-status/${bookId}`,{
//   method:"PUT",
//   headers:{
//     "Content-Type":"application/json"
//   },
//   body: JSON.stringify({ bookId, status: newStatus })

//   })

//   if (sendIT.ok){
//     console.log(`status changd to ${newStatus}`)
//     await loadBookings();
//   }
//   else{
//     console.error("what happenede");
//     const errorText = await sendIT.text();
//   console.error("Error:", errorText);
//   }
// }
async function updateStatus(bookId,newStatus){


  // const bookId = event.target.getAttribute('data-id');
  // const newStatus = event.target.value;

  // const it =await saveStatusBtn.clicked;
 // const sendIT=await fetch(`http://localhost:3000/api/booking-status/${bookId}`,{
  const sendIT=await etch(`https://sports-management.azurewebsites.net/api/booking-status/${bookId}`,{
  method:"PUT",
  headers:{
    "Content-Type":"application/json"
  },
  body: JSON.stringify({ bookId, status: newStatus })

  })

  if (sendIT.ok){
    console.log(`status changd to ${newStatus}`)
    await loadBookings();
  }
  else{
    console.error("what happenede");
    const errorText = await sendIT.text();
  console.error("Error:", errorText);
  }
}
loadBookings();





