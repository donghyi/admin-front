import axios from 'axios'

export const loginAuth = ({ user_id, user_pwd }) => axios.post('/auth/login', { user_id, user_pwd })
