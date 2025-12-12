const DOGS = [
  { id: 1, name: "elsa3id", breed: "Samoyed", ageGroup: "adult", tags: ["lizom", "chikor", "y5lslk atay"], img: "C:\\Users\\lmr store\\Documents\\cs\\site\\images\\funny-doge-memes-10-692d916e1d42f-png__700.png", sound: "sounds/bark.mp3", price: 106 },
  { id: 2, name: "youcef", breed: "Siberian Husky", ageGroup: "puppy", tags: ["nas mla7", "sniffsniff", "yzghod bzaf"], img: "C:\\Users\\lmr store\\Documents\\cs\\site\\images\\4q9292.png", sound: "sounds/woof.mp3", price: 69 },
  { id: 3, name: "piano", breed: "Golden Retriever", ageGroup: "adult", tags: ["ymot bl5f", "my3rfch yl3b", "ych3l lmic wytlg tiktok", ], img: "C:\\Users\\lmr store\\Documents\\cs\\site\\images\\dog-dog-meme.gif", sound: "sounds/bark.mp3", price: 67 },
  { id: 4, name: "mahdi mohamed", breed: "Golden Retriever", ageGroup: "adult", tags: ["lizome", "y5lslk atay tanik", "lw7ch", "mch3rr"], img: "C:\\Users\\lmr store\\Documents\\cs\\site\\images\\b559b156458235be1c918453dfe24955.webp", sound: "sounds/bark.mp3", price: 55555 }
];

const state = {
  dogs: [...DOGS],
  likes: new Set(JSON.parse(localStorage.getItem("likes") || "[]")),
  search: "",
  filter: "all",
};

const gallery = document.getElementById("gallery");
const template = document.getElementById("card-template");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const shuffleBtn = document.getElementById("shuffle");

function render() {
  gallery.innerHTML = "";
  const q = state.search.toLowerCase();
  const filtered = state.dogs.filter(d => {
    const matchText = `${d.name} ${d.breed}`.toLowerCase().includes(q);
    const matchFilter = state.filter === "all" || d.ageGroup === state.filter;
    return matchText && matchFilter;
  });
  filtered.forEach(dog => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".card");
    const img = node.querySelector(".dog-img");
    const like = node.querySelector(".like-btn");
    const sound = node.querySelector(".sound-btn");
    const name = node.querySelector(".name");
    const breed = node.querySelector(".breed");
    const tags = node.querySelector(".tags");
    const priceTag = node.querySelector(".price-tag");

    img.src = dog.img;
    img.alt = `${dog.name} the ${dog.breed}`;
    name.textContent = dog.name;
    breed.textContent = dog.breed;
    if (priceTag) priceTag.textContent = `$${dog.price}`;
    dog.tags.forEach(t => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = t;
      tags.appendChild(span);
    });

    if (state.likes.has(dog.id)) like.classList.add("active");

    // Like interaction
    like.addEventListener("click", () => {
      like.classList.toggle("active");
      if (like.classList.contains("active")) state.likes.add(dog.id);
      else state.likes.delete(dog.id);
      localStorage.setItem("likes", JSON.stringify([...state.likes]));
    });

    // Sound interaction
    sound.addEventListener("click", () => {
      const audio = new Audio(dog.sound);
      audio.play().catch(() => {});
      sound.classList.add("pulse");
      setTimeout(() => sound.classList.remove("pulse"), 300);
    });

    // Zoom on double-click
    card.addEventListener("dblclick", () => {
      card.classList.toggle("zoom");
      setTimeout(() => card.classList.remove("zoom"), 1500);
    });

    // Drag-and-drop reorder
    card.addEventListener("dragstart", (e) => {
      card.classList.add("dragging");
      e.dataTransfer.setData("text/plain", dog.id.toString());
    });
    card.addEventListener("dragend", () => card.classList.remove("dragging"));

    // Allow dropping between cards
    card.addEventListener("dragover", (e) => {
      e.preventDefault();
      const draggingId = Number(e.dataTransfer.getData("text/plain"));
      const fromIndex = state.dogs.findIndex(d => d.id === draggingId);
      const toIndex = state.dogs.findIndex(d => d.id === dog.id);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;
      const moved = state.dogs.splice(fromIndex, 1)[0];
      state.dogs.splice(toIndex, 0, moved);
      render();
    });

    gallery.appendChild(node);
  });
}

searchInput.addEventListener("input", (e) => {
  state.search = e.target.value;
  render();
});

filterSelect.addEventListener("change", (e) => {
  state.filter = e.target.value;
  render();
});

shuffleBtn.addEventListener("click", () => {
  state.dogs.sort(() => Math.random() - 0.5);
  render();
});

// Initial render
render();