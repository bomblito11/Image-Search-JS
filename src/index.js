import Notiflix, { Notify } from 'notiflix';
import _ from 'lodash';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formElement = document.querySelector('form#search-form');
const searchInput = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const APIKey = '33145437-994e290732205a7e04a0a5ef4';
let page = 1;
let totalPages;
loadMoreBtn.setAttribute('hidden', 'hidden');

formElement.addEventListener('submit', submitHandler);

function submitHandler(event) {
  event.preventDefault();
  gallery.innerHTML = null;
  page = 1;
  let searchValue = searchInput.value.toLowerCase().split(' ').join('+');

  if (searchValue === '') {
    Notiflix.Notify.failure('Search field can`t be empty');
  } else {
    fetchImages(searchValue);
  }
}

async function fetchImages(searchValue) {
  try {
    const response = await axios.get(`https://pixabay.com/api/`, {
      params: {
        key: APIKey,
        q: searchValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safeSearch: true,
        page,
        per_page: 40,
      },
    });

    const imagesArray = [...response.data.hits];
    const totalHits = response.data.totalHits;
    const totalPages = Math.ceil(totalHits / 40);

    if (page === 1) {
      Notiflix.Notify.info(`Horray! We found ${totalHits} images.`);
      loadMoreBtn.removeAttribute('hidden');
    }

    if (totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (page === totalPages) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.setAttribute('hidden', 'hidden');
    }

    renderImages(imagesArray);

    if (page > 1) {
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Sorry, something went wrong.');
  }
}

function renderImages(images) {
  images.forEach(image => {
    gallery.insertAdjacentHTML(
      'beforeend',
      `
    <div class="photo-card">
      <div class="img-container">
        <a href="${image.largeImageURL}">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
      </div>
      <div class="info">
        <p class="info-item">
          <b>Likes</b> ${image.likes}
        </p>
        <p class="info-item">
          <b>Views</b> ${image.views}
        </p>
        <p class="info-item">
          <b>Comments</b> ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b> ${image.downloads}
        </p>
      </div>
    </div>`
    );
  });
  lightbox.refresh();
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

loadMoreBtn.addEventListener('click', () => {
  page += 1;
  const searchValue = searchInput.value;
  fetchImages(searchValue);
});
