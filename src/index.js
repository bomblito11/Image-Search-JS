import Notiflix from 'notiflix';
import _ from 'lodash';
import axios from 'axios';

const formElement = document.querySelector('form#search-form');
const searchInput = document.querySelector('input');
const gallery = document.querySelector('.gallery');

const APIKey = '33145437-994e290732205a7e04a0a5ef4';
let page = 1;

formElement.addEventListener('submit', submitHandler);

function submitHandler(event) {
  event.preventDefault();
  gallery.innerHTML = null;

  let searchValue = searchInput.value.toLowerCase().split(' ').join('+');

  fetchImages(searchValue).then(result => renderImages(result));
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

    if (imagesArray.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    return imagesArray;
  } catch (error) {
    console.log(error);
  }
}

function renderImages(images) {
  images.forEach(image => {
    let galleryItem = document.createElement('div');
    galleryItem.classList.add('photo-card');
    galleryItem.innerHTML = `
    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
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
    </div>`;
    gallery.appendChild(galleryItem);
  });
}
