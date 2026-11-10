const list = document.querySelector("#observations");
const form = document.querySelector("#submission-form");

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
  return body;
}

const makeButton = (className, label, attributes = {}) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;

  for (const [name, value] of Object.entries(attributes)) {
    button.setAttribute(name, value);
  }

  return button;
};

function buildItem(observation) {
  const item = document.createElement("li");
  item.dataset.id = observation.id;

  const h3 = document.createElement("h3");
  h3.textContent = `treeId: ${observation.treeId}, phenophase: ${observation.phenophase}, date: ${observation.date}, percent: ${observation.percent}`;
  let confimation;
  if (observation.confirmed) {
    confirmation = document.createElement("span");
    confirmation.className = "badge";
    confirmation.textContent = "Confirmed";
  } else {
    confirmation = makeButton("confirm-btn", "Confirm", {
      "hx-put": `/observations/${observation.id}/confirm`,
      "hx-target": "closest li",
      "hx-swap": "outerHTML",
      "hw-disabled-elt": "this",
    });
  }
  const deleteButton = makeButton("delete-btn", "Delete", {
    "hx-delete": `/observations/${observation.id}`,
    "hx-target": "closest li",
    "hx-swap": "outerHTML",
    "hw-disabled-elt": "this",
  });
  item.append(h3, confirmation, deleteButton);
  return item;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const entry = Object.fromEntries(data);
  entry.percent = Number(entry.percent);
  const button = form.querySelector("button");

  // One save at a time: a second click while this one is out does nothing.
  button.disabled = true;
  try {
    const saved = await fetchJSON("/observations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    const item = buildItem(saved);
    list.append(item);
    htmx.process(item);
    form.reset();
  } catch (error) {
    alert(`Your observation was not saved. ${error.message}`);
  } finally {
    button.disabled = false;
  }
});
