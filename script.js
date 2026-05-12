const books = [
  {
    id: 0,
    title: "Cuentos Para Salir Al Recreo",
    author: "Margarita Maine",
    img: "img/Cuentos_para_salir_al_recreo.jpg",
    pdf: "pdfs/Cuentos_Para_Salir_Al_Recreo.pdf",
    category: "clasico"
  },
  {
    id: 1,
    title: "Orgullo y Prejuicio",
    author: "Jane Austen",
    img: "https://picsum.photos/id/237/300/420",
    pdf: "pdfs/pride.pdf",
    category: "clasico"
  },
  {
    id: 2,
    title: "Frankenstein",
    author: "Mary Shelley",
    img: "https://picsum.photos/id/180/300/420",
    pdf: "pdfs/frankenstein.pdf",
    category: "ficcion"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    img: "https://picsum.photos/id/201/300/420",
    pdf: "pdfs/1984.pdf",
    category: "ficcion"
  },
  {
    id: 4,
    title: "El Origen de las Especies",
    author: "Charles Darwin",
    img: "https://picsum.photos/id/133/300/420",
    pdf: "pdfs/origen.pdf",
    category: "ciencia"
  },
  // Agrega más libros aquí...
];

let currentFilter = 'all';

// Renderizar libros
function renderBooks(filteredBooks) {
  const rows = {
    clasico: document.getElementById('row-clasicos'),
    ficcion: document.getElementById('row-ficcion'),
    ciencia: document.getElementById('row-ciencia')
  };

  // Limpiar
  Object.values(rows).forEach(row => row.innerHTML = '');

  filteredBooks.forEach(book => {
    const cardHTML = `
      <div class="card" onclick="openModal(${book.id})">
        <img src="${book.img}" alt="${book.title}">
        <div class="card-info">
          <h3>${book.title}</h3>
          <p style="font-size:0.9rem; color:#aaa;">${book.author}</p>
          <button class="download-btn" onclick="event.stopImmediatePropagation(); window.open('${book.pdf}', '_blank')">Descargar</button>
        </div>
      </div>
    `;

    if (rows[book.category]) {
      rows[book.category].innerHTML += cardHTML;
    } else {
      rows.clasico.innerHTML += cardHTML; // default
    }
  });
}

// Modal PDF
let currentPDF = null;

async function openModal(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;

  document.getElementById('modal-title').textContent = book.title;
  document.getElementById('modal-download-btn').href = book.pdf;
  document.getElementById('pdfModal').style.display = 'flex';

  // Cargar PDF
  const loadingTask = pdfjsLib.getDocument(book.pdf);
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);
  
  const canvas = document.getElementById('pdfCanvas');
  const context = canvas.getContext('2d');
  
  const viewport = page.getViewport({ scale: 1.5 });
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await page.render({ canvasContext: context, viewport: viewport }).promise;
}

function closeModal() {
  document.getElementById('pdfModal').style.display = 'none';
}

// Filtro por categoría
function filterCategory(cat) {
  currentFilter = cat;
  let filtered = books;
  if (cat !== 'all') {
    filtered = books.filter(b => b.category === cat);
  }
  renderBooks(filtered);
}

// Búsqueda
document.getElementById('searchInput').addEventListener('keyup', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = books.filter(book => 
    book.title.toLowerCase().includes(term) || 
    book.author.toLowerCase().includes(term)
  );
  renderBooks(filtered);
});

// Inicializar
renderBooks(books);
