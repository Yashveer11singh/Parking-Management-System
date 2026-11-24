// Parking Management System - simple student project

const STORAGE_KEY = "parkMateRecords";
const RATES = { Bike: 10, Car: 30, SUV: 40, Bus: 60 };

function hoursAgo(hours) {
  return Date.now() - hours * 60 * 60 * 1000;
}

function daysAgo(days) {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

function getDemoData() {
  return {
    active: [
      {
        id: 1,
        owner: "Rahul Sharma",
        mobile: "9876543210",
        number: "RJ14CD1234",
        type: "Car",
        slot: "P01",
        entryTime: hoursAgo(2),
      },
      {
        id: 2,
        owner: "Priya Singh",
        mobile: "9876501234",
        number: "RJ14AB5678",
        type: "Bike",
        slot: "P02",
        entryTime: hoursAgo(1),
      },
      {
        id: 3,
        owner: "Amit Verma",
        mobile: "9829012345",
        number: "RJ14EF9012",
        type: "SUV",
        slot: "P03",
        entryTime: hoursAgo(3),
      },
      {
        id: 4,
        owner: "Neha Kumari",
        mobile: "9783456120",
        number: "RJ14GH3456",
        type: "Bike",
        slot: "P04",
        entryTime: hoursAgo(1.5),
      },
    ],
    history: [
      {
        id: 5,
        owner: "Vikas Meena",
        mobile: "9876123401",
        number: "RJ14JK1122",
        type: "Car",
        slot: "P05",
        entryTime: daysAgo(1) - 3 * 60 * 60 * 1000,
        exitTime: daysAgo(1),
        duration: 3,
        fee: 90,
      },
      {
        id: 6,
        owner: "Pooja Jain",
        mobile: "9876123402",
        number: "RJ14LM3344",
        type: "Bike",
        slot: "P06",
        entryTime: daysAgo(2) - 2 * 60 * 60 * 1000,
        exitTime: daysAgo(2),
        duration: 2,
        fee: 20,
      },
      {
        id: 7,
        owner: "Mohit Yadav",
        mobile: "9876123403",
        number: "RJ14NP5566",
        type: "SUV",
        slot: "P07",
        entryTime: daysAgo(3) - 2 * 60 * 60 * 1000,
        exitTime: daysAgo(3),
        duration: 2,
        fee: 80,
      },
      {
        id: 8,
        owner: "Kavita Sharma",
        mobile: "9876123404",
        number: "RJ14QR7788",
        type: "Car",
        slot: "P08",
        entryTime: daysAgo(4) - 1 * 60 * 60 * 1000,
        exitTime: daysAgo(4),
        duration: 1,
        fee: 30,
      },
      {
        id: 9,
        owner: "Deepak Singh",
        mobile: "9876123405",
        number: "RJ14ST9900",
        type: "Bike",
        slot: "P09",
        entryTime: daysAgo(5) - 4 * 60 * 60 * 1000,
        exitTime: daysAgo(5),
        duration: 4,
        fee: 40,
      },
      {
        id: 10,
        owner: "Anjali Gupta",
        mobile: "9876123406",
        number: "RJ14UV2211",
        type: "Bus",
        slot: "P10",
        entryTime: daysAgo(6) - 2 * 60 * 60 * 1000,
        exitTime: daysAgo(6),
        duration: 2,
        fee: 120,
      },
    ],
  };
}

let parkingData;
const slotNames = [
  "P01",
  "P02",
  "P03",
  "P04",
  "P05",
  "P06",
  "P07",
  "P08",
  "P09",
  "P10",
];

function loadData() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    try {
      parkingData = JSON.parse(savedData);
    } catch (error) {
      parkingData = getDemoData();
    }
  } else {
    parkingData = getDemoData();
  }
  saveData();
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parkingData));
}

function formatDate(time) {
  return new Date(time).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function getDuration(entryTime) {
  const milliseconds = Date.now() - entryTime;
  return Math.max(1, Math.ceil(milliseconds / (60 * 60 * 1000)));
}

function updateDashboard() {
  const occupied = parkingData.active.length;
  const available = slotNames.length - occupied;
  const collection = parkingData.history.reduce(
    (total, record) => total + Number(record.fee || 0),
    0,
  );

  document.getElementById("totalSlots").textContent = slotNames.length;
  document.getElementById("availableSlots").textContent = available;
  document.getElementById("occupiedSlots").textContent = occupied;
  document.getElementById("totalCollection").textContent =
    formatMoney(collection);
  document.getElementById("activeCount").textContent = occupied + " Vehicles";
}

function drawSlots() {
  const slotGrid = document.getElementById("slotGrid");
  const slotSelect = document.getElementById("slotNumber");
  slotGrid.innerHTML = "";
  slotSelect.innerHTML = "";

  slotNames.forEach(function (slot) {
    const vehicle = parkingData.active.find(function (item) {
      return item.slot === slot;
    });

    const card = document.createElement("div");
    card.className = vehicle ? "slot-card occupied" : "slot-card";
    card.innerHTML = `
      <div class="slot-top">
        <span class="slot-name">${slot}</span>
        <span class="slot-status">${vehicle ? "Occupied" : "Available"}</span>
      </div>
      <span class="slot-vehicle">${vehicle ? vehicle.number : "Free parking space"}</span>
    `;
    slotGrid.appendChild(card);

    if (!vehicle) {
      const option = document.createElement("option");
      option.value = slot;
      option.textContent = slot + " - Available";
      slotSelect.appendChild(option);
    }
  });

  if (slotSelect.options.length === 0) {
    const option = document.createElement("option");
    option.textContent = "No slots available";
    option.value = "";
    slotSelect.appendChild(option);
    slotSelect.disabled = true;
  } else {
    slotSelect.disabled = false;
  }
}

function drawActiveVehicles() {
  const table = document.getElementById("activeTable");
  const searchText = document
    .getElementById("activeSearch")
    .value.toLowerCase();
  table.innerHTML = "";

  const filteredVehicles = parkingData.active.filter(function (vehicle) {
    return (
      vehicle.owner.toLowerCase().includes(searchText) ||
      vehicle.number.toLowerCase().includes(searchText)
    );
  });

  filteredVehicles.forEach(function (vehicle) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><div class="vehicle-main">${vehicle.number}</div><div class="vehicle-sub">${vehicle.owner}</div></td>
      <td>${vehicle.slot}</td>
      <td>${formatDate(vehicle.entryTime)}</td>
      <td><div class="action-buttons">
        <button class="text-button" type="button" onclick="editVehicle(${vehicle.id})">Edit</button>
        <button class="text-button exit" type="button" onclick="exitVehicle(${vehicle.id})">Exit</button>
        <button class="text-button delete" type="button" onclick="deleteActive(${vehicle.id})">Delete</button>
      </div></td>
    `;
    table.appendChild(row);
  });

  document.getElementById("activeEmpty").hidden = filteredVehicles.length > 0;
}

function drawHistory() {
  const table = document.getElementById("historyTable");
  const searchText = document
    .getElementById("historySearch")
    .value.toLowerCase();
  table.innerHTML = "";

  const filteredRecords = parkingData.history.filter(function (record) {
    return (
      record.owner.toLowerCase().includes(searchText) ||
      record.number.toLowerCase().includes(searchText)
    );
  });

  filteredRecords.forEach(function (record) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${record.number}</td>
      <td>${record.owner}</td>
      <td>${record.type}</td>
      <td>${record.slot}</td>
      <td>${record.duration} hr</td>
      <td><strong>${formatMoney(record.fee)}</strong></td>
      <td><span class="status-pill completed">Completed</span></td>
      <td><button class="text-button delete" type="button" onclick="deleteHistory(${record.id})">Delete</button></td>
    `;
    table.appendChild(row);
  });

  document.getElementById("historyEmpty").hidden = filteredRecords.length > 0;
}

function refreshPage() {
  updateDashboard();
  drawSlots();
  drawActiveVehicles();
  drawHistory();
}

function showMessage(message, isError) {
  const messageBox = document.getElementById("formMessage");
  messageBox.textContent = message;
  messageBox.className = isError ? "form-message error" : "form-message";
}

document.getElementById("vehicleType").addEventListener("change", function () {
  const type = this.value;
  document.getElementById("rateInfo").textContent =
    "Parking rate: " + formatMoney(RATES[type]) + " per hour";
});

document
  .getElementById("entryForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const owner = document.getElementById("ownerName").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const number = document
      .getElementById("vehicleNumber")
      .value.trim()
      .toUpperCase();
    const type = document.getElementById("vehicleType").value;
    const slot = document.getElementById("slotNumber").value;

    if (!/^[0-9]{10}$/.test(mobile)) {
      showMessage("Please enter a valid 10 digit mobile number.", true);
      return;
    }
    if (!slot) {
      showMessage("No parking slot is available right now.", true);
      return;
    }
    const alreadyParked = parkingData.active.some(function (vehicle) {
      return vehicle.number.toUpperCase() === number;
    });
    if (alreadyParked) {
      showMessage("This vehicle is already parked.", true);
      return;
    }

    const newVehicle = {
      id: Date.now(),
      owner: owner,
      mobile: mobile,
      number: number,
      type: type,
      slot: slot,
      entryTime: Date.now(),
    };
    parkingData.active.push(newVehicle);
    saveData();
    refreshPage();
    this.reset();
    document.getElementById("rateInfo").textContent =
      "Parking rate: ₹30 per hour";
    showMessage(
      "Vehicle added successfully. Slot " + slot + " is now occupied.",
      false,
    );
  });

function exitVehicle(id) {
  const vehicleIndex = parkingData.active.findIndex(function (item) {
    return item.id === id;
  });
  if (vehicleIndex === -1) return;

  const vehicle = parkingData.active[vehicleIndex];
  const duration = getDuration(vehicle.entryTime);
  const fee = duration * RATES[vehicle.type];
  const confirmExit = confirm(
    "Vehicle: " +
      vehicle.number +
      "\nDuration: " +
      duration +
      " hour(s)\nParking fee: " +
      formatMoney(fee) +
      "\n\nConfirm vehicle exit?",
  );
  if (!confirmExit) return;

  parkingData.history.unshift({
    ...vehicle,
    exitTime: Date.now(),
    duration: duration,
    fee: fee,
  });
  parkingData.active.splice(vehicleIndex, 1);
  saveData();
  refreshPage();
  alert(
    "Vehicle exit completed.\nParking fee: " +
      formatMoney(fee) +
      "\nSlot " +
      vehicle.slot +
      " is now available.",
  );
}

function deleteActive(id) {
  const vehicle = parkingData.active.find(function (item) {
    return item.id === id;
  });
  if (!vehicle) return;
  if (
    !confirm(
      "Delete this active vehicle record? Its parking slot will become available.",
    )
  )
    return;
  parkingData.active = parkingData.active.filter(function (item) {
    return item.id !== id;
  });
  saveData();
  refreshPage();
}

function editVehicle(id) {
  const vehicle = parkingData.active.find(function (item) {
    return item.id === id;
  });
  if (!vehicle) return;
  document.getElementById("editId").value = vehicle.id;
  document.getElementById("editOwner").value = vehicle.owner;
  document.getElementById("editMobile").value = vehicle.mobile;
  document.getElementById("editVehicleNumber").value = vehicle.number;
  document.getElementById("editVehicleType").value = vehicle.type;
  document.getElementById("editModal").hidden = false;
}

function closeEditModal() {
  document.getElementById("editModal").hidden = true;
}

document.getElementById("closeModal").addEventListener("click", closeEditModal);
document
  .getElementById("editModal")
  .addEventListener("click", function (event) {
    if (event.target.id === "editModal") closeEditModal();
  });

document
  .getElementById("editForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const id = Number(document.getElementById("editId").value);
    const vehicle = parkingData.active.find(function (item) {
      return item.id === id;
    });
    if (!vehicle) return;

    const mobile = document.getElementById("editMobile").value.trim();
    const number = document
      .getElementById("editVehicleNumber")
      .value.trim()
      .toUpperCase();
    if (!/^[0-9]{10}$/.test(mobile)) {
      alert("Please enter a valid 10 digit mobile number.");
      return;
    }
    const duplicate = parkingData.active.some(function (item) {
      return item.id !== id && item.number.toUpperCase() === number;
    });
    if (duplicate) {
      alert("This vehicle number is already in the parking area.");
      return;
    }

    vehicle.owner = document.getElementById("editOwner").value.trim();
    vehicle.mobile = mobile;
    vehicle.number = number;
    vehicle.type = document.getElementById("editVehicleType").value;
    saveData();
    refreshPage();
    closeEditModal();
  });

function deleteHistory(id) {
  if (!confirm("Delete this parking history record?")) return;
  parkingData.history = parkingData.history.filter(function (item) {
    return item.id !== id;
  });
  saveData();
  refreshPage();
}

// Search boxes update the displayed records.
document
  .getElementById("activeSearch")
  .addEventListener("input", drawActiveVehicles);
document.getElementById("historySearch").addEventListener("input", drawHistory);

// Restore the original sample records for a fresh demonstration.
document.getElementById("resetButton").addEventListener("click", function () {
  if (!confirm("Reset the project and restore the original sample data?"))
    return;
  parkingData = getDemoData();
  saveData();
  refreshPage();
  document.getElementById("entryForm").reset();
  showMessage("Demo data has been restored.", false);
});

// Set today's date in the dashboard.
document.getElementById("todayDate").textContent =
  new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

loadData();
refreshPage();
