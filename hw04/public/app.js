const list = document.querySelector("#observations");
const form = document.querySelector("#submission-form");

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
  return body;
}
function buildItem(observation) {
  const li = document.createElement("li");
  const p = document.createElement("p");
  p.textContent = `treeId: ${observation.treeId}, phenophase: ${observation.phenophase}, date: ${observation.date}, percent: ${observation.percent}`;
  li.append(p);
  return li;
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
    list.append(buildItem(saved));
    form.reset();
  } catch (error) {
    alert(`Your observation was not saved. ${error.message}`);
  } finally {
    button.disabled = false;
  }
});
