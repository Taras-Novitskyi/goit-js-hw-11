import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '30573332-0a11d85a4e1507990835feb20';

export default class PictureApiServer {
  constructor() {
    this.searchQuery = '',
	this.page = 1,
	this.perPage = 40
  };

	fetchPicture() {
	  const options = {
      params: {
        q: `${this.searchQuery}`,
        key: API_KEY,
        image_type: 'foto',
        orientation: 'horizontal',
        safesearch: true,
        page: `${this.page}`,
        per_page: `${this.perPage}`,
      },
    };
    return axios.get(`${BASE_URL}`, options).then(({ data }) => {
		this.page += 1;
		// console.log(data);
      return data;
    });
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
	}
	
	resetPage() {
		this.page = 1
	}
}
