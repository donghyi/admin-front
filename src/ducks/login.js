import { createReducer } from 'redux-act'
import * as app from './app'

export const REDUCER = 'login';

export const submit = ({ username, password }: { username: string, password: string }) => (
  dispatch: Function,
  getState: Function,
) => {
  app.login(username, password, dispatch)
};

const initialState = {};
export default createReducer({}, initialState)
