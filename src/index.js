import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm"

let getEl = selector => document.querySelector(selector);

const API_KEY = '31043334-d435e709e031a3a5e6d394209';
const input = getEl('input');
const form = getEl('.search-form');
const gallery = getEl('.gallery');
const loadMoreButton = getEl('.load-more');
let page = 1;
let amountOfImages = 0;
let loadedImages = 0;

const submitFunction=()=> {
  event.preventDefault();
  gallery.innerHTML = ''; 
  page = 1;
  mamaFunction(); 
  console.log(amountOfImages,loadedImages);
}

const loadMoreFunction = () => {
  page += 1;
  mamaFunction();

  if (loadedImages >= amountOfImages) {
    loadMoreButton.classList.add('hidden')
  }
   
}
function mamaFunction() {
  fetchImage(input.value).then(image => renderImages(image)).then((result)=>console.log(result)).catch((error) => console.error(error));
 
  
}
form.addEventListener('submit', submitFunction);

loadMoreButton.addEventListener('click', loadMoreFunction);

function fetchImage(link) {
   return fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${input.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`)
      .then(
    (response) => {        
           
         return response.json();
    }
  )
}
function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function renderImages(image) {
  if (image.totalHits > 0) {
    
    loadMoreButton.classList.remove('hidden');
    Notiflix.Notify.success(`Hooray! We found ${image.totalHits} images.`)
    const markup = image.hits.map((im) => `<a class='image-card' style="background-color:${getRandomHexColor()};color:${getRandomHexColor()}" href="${im.largeImageURL}">
   <img class='img' src='${im.webformatURL}' loading="lazy"title="${im.tags}" alt='${im.tags}' width='260' height='200'>
   <div class="text-content">
    <div class="text-elements">
      <p class="heading">likes</p> 
      <p class="text">${im.likes}</p>
    </div>
    <div class="text-elements">
      <p class="heading">views</p> 
      <p class="text">${im.views}</p>
    </div>
    <div class="text-elements">
      <p class="heading">comments</p> 
      <p class="text">${im.comments}</p>
    </div>
    <div class="text-elements">
      <p class="heading">downloads</p> 
      <p class="text">${im.downloads}</p>
    </div>  
  </div>
   </a>
  `).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  new SimpleLightbox('.gallery a', {
	captionDelay: 250
  })
  }
  else { loadMoreButton.classList.add('hidden'); Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again."); }
   
}

