import Notiflix from 'notiflix';
import fotoCardsTpl from './template/foto-card.hbs';
import PictureApiServer from "./js/picturesApiServer";
import LoadMoreBtn from './js/loadMoreBtn';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  guard: document.querySelector('.load-more'),
};
const options = {
  root: null,
  rootMargin: '50px',
  threshold: 1,
};

const gallery = new SimpleLightbox('.gallery a', {});
const picturesApiServer = new PictureApiServer();
const loadMoreBtn = new LoadMoreBtn('.load-more', true);
const observer = new IntersectionObserver(onLastLoad, options);

loadMoreBtn.refs.button.addEventListener('click', addPicturesAndUpdateUI);
refs.form.addEventListener('submit', onSubmitForm);


function onSubmitForm(e) {
  e.preventDefault();
  clearGalleryContainer();
  picturesApiServer.resetPage();

  picturesApiServer.query = e.currentTarget.searchQuery.value.trim();

    if (picturesApiServer.query === '') {
      Notiflix.Notify.warning('Please enter your search query.');
      loadMoreBtn.hide();
      return
    } 
  
  loadMoreBtn.show();
  addPicturesAndUpdateUI();
}

async function addPicturesAndUpdateUI() {
  try {
    loadMoreBtn.disable();
    observer.unobserve(refs.guard);

    const data = await picturesApiServer.fetchPicture();
    renderGalleryList(data);
    picturesApiServer.increasePage();
    gallery.refresh();

    if (data.totalHits <= picturesApiServer.perPage) {
      loadMoreBtn.hide();
      return;
    }

    loadMoreBtn.enable();
  } catch (err) {
    onFetchError(err);
  };
}

function renderGalleryList(data) {
  const totalPages = Math.ceil(data.totalHits / picturesApiServer.perPage);
  const currentPage = picturesApiServer.page;

  if (data.totalHits === 0) {
    loadMoreBtn.hide();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    clearGalleryContainer();
    return;
  }

  refs.gallery.insertAdjacentHTML('beforeend', fotoCardsTpl(data.hits));

    if (currentPage === 1) {
      return Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
    
  makeSmoothScroll();
    
  if (currentPage === totalPages) {
    observer.observe(refs.guard);
    }
}

function onFetchError(err) {
	console.log(err);
	clearGalleryContainer();
}

function clearGalleryContainer() {
  refs.gallery.innerHTML = '';
}

function makeSmoothScroll() {
  const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  
}

function onLastLoad(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {

      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      
      loadMoreBtn.hide();
    }
  });
}