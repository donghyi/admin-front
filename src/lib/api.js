import axios from 'axios';
import queryString from 'query-string';

export const loginAuth = () => axios.post('/cdnservice/auth/adminLogin');