// DOM references
const searchBtn = document.getElementById('search-btn');
const shareBtn = document.getElementById('share-btn');
const searchSection = document.querySelector('.search');
const shareSection = document.querySelector('.share');

// Initial state: Display search section and hide share section
searchSection.style.display = 'block';
shareSection.style.display = 'none';

// Event listener for the "Search" button
searchBtn.addEventListener('click', () => {
  // Update button states
  searchBtn.classList.add('selected');
  shareBtn.classList.remove('selected');

  // Show search section, hide share section
  searchSection.style.display = 'block';
  shareSection.style.display = 'none';
});

// Event listener for the "Share" button
shareBtn.addEventListener('click', () => {
  // Update button states
  shareBtn.classList.add('selected');
  searchBtn.classList.remove('selected');

  // Show share section, hide search section
  searchSection.style.display = 'none';
  shareSection.style.display = 'block';
});
