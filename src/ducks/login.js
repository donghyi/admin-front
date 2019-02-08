import { createReducer } from 'redux-act'
import * as app from './app'

export const REDUCER = 'login';

export const submit = ({ user_id, user_pwd }: { user_id: string, user_pwd: string }) => (
  dispatch: Function,
  getState: Function,
) => {
  app.login(user_id, user_pwd, dispatch)
};

const initialState = {};
export default createReducer({}, initialState)
