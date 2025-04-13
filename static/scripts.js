// your existing JavaScript code — no changes needed here!
   async function addCharacter() {
    const name = document.getElementById("name").value.trim();
    if (!name) {
        showAlert("Name is required.", "error");
        return;
    }
    const age = parseInt(document.getElementById("age").value, 10);
    if (isNaN(age)) {
        showAlert("Age must be a valid number.", "error");
        return;
    }
    const race = document.getElementById("race").value;
    const affiliation = document.getElementById("affiliation").value;
    const description = document.getElementById("description").value;
    const title = document.getElementById("title").value;
    const alignment = document.getElementById("alignment").value;
    const imageInput = document.getElementById("characterImage");

    let imageUrl = "/uploads/placeholder_char.png"; // Default image URL

    // Check if an image is uploaded
    if (imageInput.files.length > 0) {
        const formData = new FormData();
        formData.append("file", imageInput.files[0]);

        console.log("FormData:", formData.get("file")); // Debugging log

        // Upload the image
        const uploadResponse = await fetch("/upload", {
            method: "POST",
            body: formData
        });

        if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            imageUrl = uploadResult.file_url; // Use the uploaded image URL
        } else {
            console.error("Failed to upload image.");
            showAlert("Failed to upload image. Please try again.", "error");
            return;
        }
    }

    // Create the character object
    const character = {
        name,
        race,
        affiliation,
        description,
        age,
        title,
        alignment,
        image_url: imageUrl
    };

    console.log("Character object being sent:", character); // Debugging log

    // Send the character data to the backend
    const response = await fetch('/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character)
    });

    if (response.ok) {
        showAlert("Character added successfully!");
        loadCharacters(); // Reload the character table
    } else {
        showAlert("Failed to add character. Please try again.", "error");
    }
}

async function addItem() {
    const item = {
        name: document.getElementById("itemName").value,
        type: document.getElementById("itemType").value,
        rarity: document.getElementById("itemRarity").value,
        description: document.getElementById("itemDescription").value
    };
    await fetch('/items', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item)
    });
    loadItems();
    loadStats();
}

async function addLocation() {
    const location = {
        name: document.getElementById("locationName").value,
        region: document.getElementById("locationRegion").value,
        description: document.getElementById("locationDescription").value,
        danger_level: document.getElementById("locationDanger").value
    };
    await fetch('/locations', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(location)
    });
    loadLocations();
    loadStats();
}

async function addEvent() {
    const event = {
        name: document.getElementById("eventName").value,
        date: document.getElementById("eventDate").value,
        location: document.getElementById("eventLocation").value,
        description: document.getElementById("eventDescription").value
    };
    await fetch('/events', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(event)
    });
    loadEvents();
    loadStats();
}

async function loadCharacters() {
    const response = await fetch('/characters');
    const characters = await response.json();
    const tableBody = document.getElementById("characterTableBody");
    tableBody.innerHTML = "";
    characters.forEach(c => {
        const row = `<tr class="border-b">
            <td class="p-2">
                <img src="${c.image_url || '/uploads/default-image.png'}" alt="${c.name}" class="w-16 h-16 object-cover">
            </td>
            <td class="p-2">
                <a href="#" onclick="showDetails('character', '${c.name}')" class="text-blue-600 hover:underline">${c.name}</a>
            </td>
            <td class="p-2">${c.title}</td>
            <td class="p-2">${c.race}</td>
            <td class="p-2">${c.affiliation}</td>
            <td class="p-2">${c.alignment}</td>
            <td class="p-2">${c.age}</td>
            <td class="p-2">${c.description}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

async function loadItems() {
    const response = await fetch('/items');
    const items = await response.json();
    const tableBody = document.getElementById("itemTableBody");
    tableBody.innerHTML = "";
    items.forEach(i => {
        const row = `<tr class="border-b">
            <td class="p-2">
                <a href="#" onclick="showDetails('item', '${i.name}')" class="text-blue-600 hover:underline">${i.name}</a>
            </td>
            <td class="p-2">${i.type}</td>
            <td class="p-2">${i.rarity}</td>
            <td class="p-2">${i.description}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

async function loadLocations() {
    const response = await fetch('/locations');
    const locations = await response.json();
    const tableBody = document.getElementById("locationTableBody");
    tableBody.innerHTML = "";
    locations.forEach(l => {
        const row = `<tr class="border-b">
            <td class="p-2">
                <a href="#" onclick="showDetails('location', '${l.name}')" class="text-blue-600 hover:underline">${l.name}</a>
            </td>
            <td class="p-2">${l.region}</td>
            <td class="p-2">${l.danger_level}</td>
            <td class="p-2">${l.description}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

async function loadEvents() {
    const response = await fetch('/events');
    const events = await response.json();
    const tableBody = document.getElementById("eventTableBody");
    tableBody.innerHTML = "";
    events.forEach(e => {
        const row = `<tr class="border-b">
            <td class="p-2">
                <a href="#" onclick="showDetails('event', '${e.name}')" class="text-blue-600 hover:underline">${e.name}</a>
            </td>
            <td class="p-2">${e.date}</td>
            <td class="p-2">${e.location}</td>
            <td class="p-2">${e.description}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

async function loadStats() {
    const response = await fetch('/stats');
    const stats = await response.json();
    document.getElementById("stats").innerText = 
        `Characters: ${stats.Characters}, Items: ${stats.Items}, Locations: ${stats.Locations}`;
}

async function deleteCharacter(name) {
    if (confirm(`Are you sure you want to delete the character '${name}'?`)) {
        const response = await fetch(`/character/${encodeURIComponent(name)}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert(`Character '${name}' deleted successfully!`);
            loadCharacters(); // Reload the table
        } else {
            alert(`Failed to delete character '${name}'.`);
        }
    }
}

async function deleteItem(name) {
    if (confirm(`Are you sure you want to delete the item '${name}'?`)) {
        const response = await fetch(`/items/${encodeURIComponent(name)}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert(`Item '${name}' deleted successfully!`);
            loadItems(); // Reload the table
        } else {
            alert(`Failed to delete item '${name}'.`);
        }
    }
}

async function deleteLocation(name) {
    if (confirm(`Are you sure you want to delete the location '${name}'?`)) {
        const response = await fetch(`/location/${encodeURIComponent(name)}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert(`Location '${name}' deleted successfully!`);
            loadLocations(); // Reload the table
        } else {
            alert(`Failed to delete location '${name}'.`);
        }
    }
}

async function deleteEvent(name) {
    if (confirm(`Are you sure you want to delete the event '${name}'?`)) {
        const response = await fetch(`/event/${encodeURIComponent(name)}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert(`Event '${name}' deleted successfully!`);
            loadEvents(); // Reload the table
        } else {
            alert(`Failed to delete event '${name}'.`);
        }
    }
}

async function showDetails(type, name) {
    try {
        const response = await fetch(`/${type}/${encodeURIComponent(name)}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch details for ${type}: ${name}`);
        }
        const htmlContent = await response.text();

        const modalContent = document.getElementById("modalContent");
        modalContent.innerHTML = htmlContent;

        // Set the entity type and name as attributes on the modal
        modalContent.setAttribute("data-type", type); // Ensure this is "items" for items
        modalContent.setAttribute("data-name", name);

        document.getElementById("detailsModal").classList.remove("hidden");
    } catch (error) {
        console.error(error);
        alert("Failed to load details. Please try again.");
    }
}

function closeModal() {
    const modalContent = document.getElementById("modalContent");
    const editForm = document.getElementById("editForm");
    const editButton = document.getElementById("editButton");
    const saveButton = document.getElementById("saveButton");
    const cancelButton = document.getElementById("cancelButton");

    // Clear modal content and reset the modal state
    modalContent.innerHTML = "";
    editForm.innerHTML = "";
    modalContent.removeAttribute("data-type");
    modalContent.removeAttribute("data-name");

    // Reset buttons and visibility
    modalContent.classList.remove("hidden");
    editForm.classList.add("hidden");
    editButton.classList.remove("hidden");
    saveButton.classList.add("hidden");
    cancelButton.classList.add("hidden");

    // Hide the modal
    document.getElementById("detailsModal").classList.add("hidden");
}

function switchForm(type) {
    document.getElementById("characterForm").classList.add("hidden");
    document.getElementById("itemForm").classList.add("hidden");
    document.getElementById("locationForm").classList.add("hidden");
    document.getElementById("eventForm").classList.add("hidden");

    if (type === "character") document.getElementById("characterForm").classList.remove("hidden");
    if (type === "item") document.getElementById("itemForm").classList.remove("hidden");
    if (type === "location") document.getElementById("locationForm").classList.remove("hidden");
    if (type === "event") document.getElementById("eventForm").classList.remove("hidden");
}

function filterCharacters() {
    const search = document.getElementById("searchBar").value.toLowerCase();
    const rows = document.querySelectorAll("#characterTableBody tr");
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(search) ? "" : "none";
    });
}

function enableEdit() {
    const modalContent = document.getElementById("modalContent");
    const editForm = document.getElementById("editForm");

    // Hide the static content and show the editable form
    modalContent.classList.add("hidden");
    editForm.classList.remove("hidden");

    // Populate the form with existing data
    const fields = modalContent.querySelectorAll("[data-field]");
    fields.forEach(field => {
        const fieldName = field.getAttribute("data-field");
        const input = document.createElement("input");
        input.type = "text";
        input.name = fieldName;
        input.value = field.textContent.trim();
        input.className = "p-2 border rounded w-full mb-2";
        editForm.appendChild(input);
    });

    // Show Save and Cancel buttons
    document.getElementById("saveButton").classList.remove("hidden");
    document.getElementById("cancelButton").classList.remove("hidden");
    document.getElementById("editButton").classList.add("hidden");
}

async function saveEdit() {
    const modalContent = document.getElementById("modalContent");
    const editForm = document.getElementById("editForm");
    const inputs = editForm.querySelectorAll("input");
    const updatedData = {};

    // Collect updated data from the form
    inputs.forEach(input => {
        updatedData[input.name] = input.value.trim();
    });

    console.log("Updated Data:", updatedData); // Debugging log

    // Get the entity type and name from the modal's attributes
    const entityType = modalContent.getAttribute("data-type"); // e.g., "character", "items", "location", "event"
    const entityName = modalContent.getAttribute("data-name"); // Original name of the entity

    console.log("Entity Type:", entityType); // Debugging log
    console.log("Entity Name:", entityName); // Debugging log

    if (!entityType || !entityName) {
        console.error("Entity type or name is missing.");
        showAlert("Failed to save changes. Please try again.", "error");
        return;
    }

    const url = `/${entityType}/${encodeURIComponent(entityName)}`;

    // Send the updated data to the backend
    const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });

    if (response.ok) {
        showAlert(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} updated successfully!`, "success");
        closeModal();

        // Reload the appropriate list based on the entity type
        if (entityType === "character") loadCharacters();
        if (entityType === "items") loadItems(); // Ensure this matches the plural form
        if (entityType === "location") loadLocations();
        if (entityType === "event") loadEvents();
    } else {
        const error = await response.json();
        console.error(`Error updating ${entityType}:`, error);
        showAlert(`Failed to update ${entityType}. Please try again.`, "error");
    }
}

function cancelEdit() {
    const modalContent = document.getElementById("modalContent");
    const editForm = document.getElementById("editForm");
    const editButton = document.getElementById("editButton");
    const saveButton = document.getElementById("saveButton");
    const cancelButton = document.getElementById("cancelButton");

    // Restore the original content
    modalContent.innerHTML = modalContent.getAttribute("data-original-content");

    // Hide the edit form and show the modal content
    modalContent.classList.remove("hidden");
    editForm.classList.add("hidden");
    editButton.classList.remove("hidden");
    saveButton.classList.add("hidden");
    cancelButton.classList.add("hidden");
}

function showAlert(message, type = "success") {
    const alertBox = document.getElementById("alertBox");
    const alertMessage = document.getElementById("alertMessage");

    // Set the message and alert type
    alertMessage.textContent = message;
    alertBox.className = `fixed bottom-4 left-4 px-4 py-2 rounded shadow-lg ${
        type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white`;

    // Show the alert box
    alertBox.classList.remove("hidden");

    // Automatically hide the alert after 3 seconds
    setTimeout(() => {
        alertBox.classList.add("hidden");
    }, 3000);
}

window.onload = () => {
    loadCharacters();
    loadItems();
    loadLocations();
    loadEvents();
    loadStats();
}