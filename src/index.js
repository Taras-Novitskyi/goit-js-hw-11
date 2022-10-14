import './css/styles.css';
import Notiflix from 'notiflix';
import fotoCardsTpl from './template/foto-card.hbs';
import PictureApiServer from "./js/picturesApiServer";
import LoadMoreBtn from './js/loadMoreBtn';


const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

const picturesApiServer = new PictureApiServer();
const loadMoreBtn = new LoadMoreBtn('.load-more', true);

loadMoreBtn.refs.button.addEventListener('click', fetchPictures);
refs.form.addEventListener('submit', onSubmitForm);


function onSubmitForm(e) {
  e.preventDefault();
  clearGalleryContainer();
  picturesApiServer.resetPage();

  picturesApiServer.query = e.currentTarget.searchQuery.value.trim();

 	if (picturesApiServer.query === '') {
      Notiflix.Notify.info('Please enter your search query.');
      loadMoreBtn.hide();
      return
  }
  
  fetchPictures();
  loadMoreBtn.show();
}

function fetchPictures() {
  loadMoreBtn.disable();
  picturesApiServer
    .fetchPicture()
    .then((data) => {
      renderGalleryList(data);

      if (data.totalHits <= picturesApiServer.perPage) {
        loadMoreBtn.hide();
        return;
      }

      loadMoreBtn.enable();
    })
    .catch(onFetchError);
}

function renderGalleryList(data) {
  const totalPages = Math.ceil(data.totalHits / picturesApiServer.perPage);
  const currentPage = picturesApiServer.page - 2;

  if (data.totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    clearGalleryContainer();
    loadMoreBtn.hide();
    return;
  }

   if (totalPages === currentPage) {
     Notiflix.Notify.info(
       "We're sorry, but you've reached the end of search results."
     );
     loadMoreBtn.hide();
     return;
   }
	
	refs.gallery.insertAdjacentHTML('beforeend', fotoCardsTpl(data.hits));
}

function onFetchError(err) {
	console.log(err);
	clearGalleryContainer();
}

function clearGalleryContainer() {
  refs.gallery.innerHTML = '';
}