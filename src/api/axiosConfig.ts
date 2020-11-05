import axios from 'axios';
import * as DEFINE from '../define';

export default function axiosConfig(): void {
  axios.defaults.withCredentials = true;
  axios.interceptors.response.use(
    response => {
      console.log('[axios.interceptors.response.use] response', response);
      return response;
    },
    function (error) {
      console.log('[axios.interceptors.response.use] error', error);
      console.log(
        '[axios.interceptors.response.use] error.response',
        error.response,
      );
      if (error.response.status === 401) {
        sessionStorage.setItem('unauthorizedError', 'true');
        window.location.replace(DEFINE.URL_PAGE_LOGIN);
      }

      return Promise.reject(error);
    },
  );
}
