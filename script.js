const newForm = document.querySelector("#new-form");
const toggleForm = document.querySelector("#toggle-form");
const activityInput = document.querySelector("#activityInput");
const descriptionInput = document.querySelector("#descriptionInput");
const dueDateInput = document.querySelector("#dueDateInput");

// eruda.init();

// Toggle form
toggleForm.addEventListener("click", () => {
  formToggler();
  if (newForm.classList.contains("new-form-toggler")) {
    scrollToTop();
    activityInput.focus();
  }
});

// Get the activities from local storage
let activities = localStorage.getItem("activities");
activities = activities ? JSON.parse(activities) : [];

// display the activities
displayActivities();

// toggle the activity form if no activities
if (activities.length < 1) formToggler()

// add a callback function to handle form submit
newForm.onsubmit = addActivity;

function displayActivities() {
  document.querySelector("#cards").innerHTML = "";
  document.querySelector("#all").innerHTML = activities.length;
  document.querySelector("#incomplete").innerHTML = activities.filter(
    a => !a.status
  ).length;
  document.querySelector("#complete").innerHTML = activities.filter(
    a => a.status
  ).length;

  activities.forEach(activity => {
    document.querySelector("#cards").innerHTML += `
      <div class="card">
        <h4 class="card-label-w-icon">
          ${activity.activity}
          <i class="fa-solid fa-trash text-red-600" onclick="deleteActivity('${
            activity.activity
          }')"></i>
        </h4>
        <pre class="card-description">${
          activity.description ? activity.description : "No description."
        }</pre
        >
        <div class="my-1 flex justify-between items-center gap-1">
          <p>Due: ${activity.due}</p>
          <div class="${
            (activity.status || dueDateChecker(activity.due) == "future") &&
            "hidden"
          } flex items-center gap-1 mr-0.5 text-sm text-red-500">
            ${
              dueDateChecker(activity.due) == "past"
                ? "<span>overdue</span>"
                : "<span>due today</span>"
            }
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
        </div>
        <div class="mt-1 grid grid-cols-2 gap-2">
          <button class="button bg-blue-200 hover:bg-gray-100 hover:text-black" onclick="editActivity('${
            activity.activity
          }')">
            <i class="fa-solid fa-pen-to-square"></i>
            Edit
          </button>
          ${
            activity.status
              ? `<button class="button bg-green-100 text-green-700 hover:bg-gray-100 hover:text-black" onclick="changeStatus('${activity.activity}')">
            <i class="fa-solid fa-check"></i>
            Completed
          </button>`
              : `<button class="button bg-red-100 flex justify-center gap-1.5 items-center hover:bg-gray-100 hover:text-black" onclick="changeStatus('${activity.activity}')">
            <i class="fa-solid fa-xmark"></i>
            Incomplete
          </button>`
          }
        </div>
      </div>
    `;
  });
}

function addActivity(e) {
  e.preventDefault();
  try {
    const newActivity = {
      activity: activityInput.value.trim(),
      description: descriptionInput.value.trim(),
      due: dueDateInput.value.trim(),
      status: false
    };

    activities.unshift(newActivity);
    localStorage.setItem("activities", JSON.stringify(activities));

    displayActivities();
    activityInput.value = "";
    descriptionInput.value = "";
    dueDateInput.value = "";
  } catch (e) {
    console.log(e);
  }
}

function editActivity(activity) {
  if (!newForm.classList.contains("new-form-toggler")) formToggler();

  document.querySelector("#title").textContent = "Edit Activity";
  document.querySelector("#submitBtn").textContent = "Save";

  for (let i = 0; i < activities.length; i++) {
    if (activities[i].activity === activity) {
      activityInput.value = activities[i].activity;
      descriptionInput.value = activities[i].description;
      dueDateInput.value = activities[i].due;
    }
  }

  newForm.onsubmit = e => {
    e.preventDefault();
    for (let i = 0; i < activities.length; i++) {
      if (activities[i].activity === activity) {
        activities[i].activity = activityInput.value;
        activities[i].description = descriptionInput.value;
        activities[i].due = dueDateInput.value;
        
        localStorage.setItem("activities", JSON.stringify(activities));
        displayActivities();
        formToggler();
      }
    }
  };

  scrollToTop();
  activityInput.focus();
}

function deleteActivity(activity) {
  if (confirm(`Are you sure you want to delete "${activity}"?`)) {
    const updatedActivities = activities.filter(a => a.activity !== activity);
    activities = updatedActivities;
    localStorage.setItem("activities", JSON.stringify(updatedActivities));
    displayActivities();
  }
}

function changeStatus(activity) {
  for (let i = 0; i < activities.length; i++) {
    if (activities[i].activity === activity)
      activities[i].status = !activities[i].status;
  }
  localStorage.setItem("activities", JSON.stringify(activities));
  displayActivities();
}

function dueDateChecker(due) {
  const dueDate = new Date(due);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (dueDate < today) {
    return "past";
  } else if (dueDate.toDateString() === today.toDateString()) {
    return "today";
  } else {
    return "future";
  }
}

function formToggler() {
  newForm.classList.toggle("new-form-toggler");
  toggleForm.classList.toggle("rotate-45");
  newForm.onsubmit = addActivity;
  activityInput.value = "";
  descriptionInput.value = "";
  dueDateInput.value = "";
  document.querySelector("#title").textContent = "Add Activity";
  document.querySelector("#submitBtn").textContent = "Add";
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
