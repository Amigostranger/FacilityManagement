const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("issueTitle").value.trim();
  const description = document.getElementById("issueDesc").value.trim();
  const facility = document.getElementById("issueFacility").value.trim();

  if (!title || !description || !facility) {
    alert("All fields are required.");
    return;
  }

  try {
    await db.collection("issues").add({
      title,
      description,
      facility,
      status: "Active",          // Default value
      createdAt: new Date(),     // Timestamp
    });

    alert("Issue reported successfully!");
    form.reset();               // Clear the form
    document.getElementById("issueModal").style.display = "none";
  } catch (err) {
    console.error("Error adding document:", err);
    alert("Failed to submit issue.");
  }
});
