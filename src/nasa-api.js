import fetch from 'isomorphic-fetch';

const API_ENDPOINT = 'https://api.nasa.gov';

const random = (items) => items[Math.floor(Math.random() * items.length)];

export default class NasaAPI {
  constructor({ api_key, soundcloud_id }) {
    this.api_key = api_key;
    this.soundcloud_id = soundcloud_id;
  }

  sound(params) {
    return this._fetch('/planetary/sounds', { ...params }).then(({ results }) => {
      const result = random(results);
      return fetch(`${result.download_url}?client_id=${this.soundcloud_id}`).then(
        response => response.url.replace('http:', 'https:')
      ).then(
        download_url => ({ ...result, download_url })
      );
    });
  }

  _fetch(endpoint, params = {}) {
    const querystring = Object.entries({ ...params, api_key: this.api_key }).reduce((state, [key, value]) => ([
      ...state,
      `${key}=${encodeURIComponent(value)}`
    ]), []);

    const url = `${API_ENDPOINT}${endpoint}?${querystring}`;

    this._log('info', 'REQUEST', url);
    return fetch(url).then(response => {
      return response.json();
    }).then(response => {
      return response.results && response.results.length ? response : Promise.reject('Empty results');
    }).catch(error => {
      this._log('error', 'FAILURE', url, error);
      return Promise.reject(error);
    });
  }

  _log(level, ...args) {
    console[level]('[NASA]', ...args);
  }
}
