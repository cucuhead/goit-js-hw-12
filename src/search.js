import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.getElementById('load-more');
const loader = document.querySelector('.loader');
const loadingText = document.querySelector('.loading-text');
const endMessage = document.querySelector('.end-message');

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '51560990-264b69e56c9798190df8f6558';

const lightbox = new SimpleLightbox('.gallery a');

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

window.addEventListener('DOMContentLoaded', () => {
       hideLoadMoreBtn();
    
  const params = new URLSearchParams(window.location.search);
  const query = params.get('query');
  if (query) {
    form.searchQuery.value = query;
    startNewSearch(query);
  }
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const query = form.searchQuery.value.trim();
  if (!query) return;
  updateQueryParam(query);
  startNewSearch(query);
});

loadMoreBtn.addEventListener('click', () => {
  currentPage += 1;
  performSearch(currentQuery, currentPage);
});

function updateQueryParam(query) {
  const newUrl = `${window.location.pathname}?query=${encodeURIComponent(query)}`;
  window.history.pushState({ path: newUrl }, '', newUrl);
}

function startNewSearch(query) {
  currentQuery = query;
  currentPage = 1;
  totalHits = 0;
  gallery.innerHTML = '';
  hideEndMessage();
  hideLoadMoreBtn();
  performSearch(query, currentPage);
}

async function performSearch(query, page = 1) {
  showLoading();
  hideLoadMoreBtn();
  try {
    const data = await fetchImages(query, page);
    totalHits = data.totalHits;

    if (data.hits.length === 0 && page === 1) {
      iziToast.warning({
        class: 'my-warning-toast',
        message: 'Sorry, no images match your search. Please try again!',
        position: 'topRight',
      });
      hideLoading();
      return;
    }

    renderGallery(data.hits, page > 1);
    updateLoadMoreVisibility(page, totalHits, data.hits.length);
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoading();
  }
}

async function fetchImages(query, page = 1) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: 20,
  };

  const response = await axios.get(BASE_URL, { params });
  if (response.status !== 200) {
    throw new Error('Fetch failed');
  }
  return response.data;
}

function renderGallery(images, append = false) {
  const markup = images
    .map(image => `
      <li class="gallery-item">
        <div class="photo-card">
          <a class="gallery-link" href="${image.largeImageURL}">
            <img class="gallery-image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          </a>
          <div class="info">
            <div class="info-column">
              <span class="info-label">Likes</span>
              <span class="info-value">${image.likes}</span>
            </div>
            <div class="info-column">
              <span class="info-label">Views</span>
              <span class="info-value">${image.views}</span>
            </div>
            <div class="info-column">
              <span class="info-label">Comments</span>
              <span class="info-value">${image.comments}</span>
            </div>
            <div class="info-column">
              <span class="info-label">Downloads</span>
              <span class="info-value">${image.downloads}</span>
            </div>
          </div>
        </div>
      </li>
    `)
    .join('');

  if (append) {
    gallery.insertAdjacentHTML('beforeend', markup);
  } else {
    gallery.innerHTML = markup;
  }

  lightbox.refresh();

  // Scroll down after loading more (append is true)
  if (append) {
    scrollPage();
  }
}

function updateLoadMoreVisibility(page, totalHits, hitsCount) {
  const totalPages = Math.ceil(totalHits / 40);
  if (page < totalPages) {
    showLoadMoreBtn();
    hideEndMessage();
  } else {
    hideLoadMoreBtn();
    showEndMessage();

    // Tüm sonuçlar yüklendiyse kullanıcıyı bilgilendir:
    iziToast.info({
      class: 'my-end-toast',
      message: "We're sorry, but you've reached the end of search results.",
      position: 'topRight',
    });
  }
}


function scrollPage() {
  const firstGalleryItem = gallery.querySelector('.gallery-item');
  if (!firstGalleryItem) return;
  const { height: cardHeight } = firstGalleryItem.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function showLoading() {
  loader.hidden = false;
  loadingText.hidden = false;
}

function hideLoading() {
  loader.hidden = true;
  loadingText.hidden = true;
}

function showLoadMoreBtn() {
 loadMoreBtn.style.display = 'block';
}

function hideLoadMoreBtn() {
  loadMoreBtn.style.display = 'none';
}

function showEndMessage() {
  endMessage.hidden = false;
}

function hideEndMessage() {
  endMessage.hidden = true;
}

