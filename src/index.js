import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';


const BASE_URL = 'https://pixabay.com/api/';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};
refs.form.addEventListener('submit', onSubmitForm);


function onSubmitForm(e) {
	e.preventDefault();
	const searchResult = e.target.value.trim();

	if (!searchResult) {
		return refs.gallery.innerHTML = '';
  }
  fetchCountries(searchResult).then(renderCountryList).catch(onFetchError);
}

function renderGalleryList(pictures) {
//   let galleryList = '';

  if (pictures.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }

	return pictures.map(picture => {
	 `<div class="photo-card">
      <img src="" alt="" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
        </p>
        <p class="info-item">
          <b>Views</b>
        </p>
        <p class="info-item">
          <b>Comments</b>
        </p>
        <p class="info-item">
          <b>Downloads</b>
        </p>
      </div>
    </div>`
	}).join('');
}


function fetchPicture(id) {
	axios.get(`${BASE_URL}/name/${id}`)
  .then(res => {
	  console.log(res.data);
	  return res;
  });

//   return fetch(
//     `${BASE_URL}/name/${id}?fields=name,capital,flags,population,languages`
//   ).then(response => {
//     if (response.ok) {
//       return response.json();
//     }
//     throw new Error(response.status);
//   });
}


function onFetchError(err) {
	console.log(err);
	Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
	refs.gallery.innerHTML = '';
}