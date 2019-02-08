import { createAction, createReducer } from 'redux-act'
import { push } from 'react-router-redux'
import { pendingTask, begin, end } from 'react-redux-spinner'
import { notification } from 'antd'
import * as api from 'lib/api'

const REDUCER = 'app'
const NS = `@@${REDUCER}/`

const _setFrom = createAction(`${NS}SET_FROM`, api.loginAuth)
const _setLoading = createAction(`${NS}SET_LOADING`)
const _setHideLogin = createAction(`${NS}SET_HIDE_LOGIN`)

const _loginAuthPending = createAction(`${NS}LOGIN_AUTH_PENDING`)
const _loginAuthSuccess = createAction(`${NS}LOGIN_AUTH_SUCCESS`)
const _loginAuthFailure = createAction(`${NS}LOGIN_AUTH_FAILURE`)

export const setUserState = createAction(`${NS}SET_USER_STATE`)
export const setUpdatingContent = createAction(`${NS}SET_UPDATING_CONTENT`)
export const setActiveDialog = createAction(`${NS}SET_ACTIVE_DIALOG`)
export const deleteDialogForm = createAction(`${NS}DELETE_DIALOG_FORM`)
export const setLayoutState = createAction(`${NS}SET_LAYOUT_STATE`)

export const setLoading = isLoading => {
  const action = _setLoading(isLoading)
  action[pendingTask] = isLoading ? begin : end
  return action
}

export const resetHideLogin = () => (dispatch, getState) => {
  const state = getState()
  if (state.pendingTasks === 0 && state.app.isHideLogin) {
    dispatch(_setHideLogin(false))
  }
  return Promise.resolve()
}

export const initAuth = roles => (dispatch, getState) => {
  // Use Axios there to get User Data by Auth Token with Bearer Method Authentication
  const userRole = window.localStorage.getItem('app.Role')
  const state = getState()

  const users = {
    administrator: {
      email: 'admin@mediatec.org',
      role: 'administrator',
    },
    agent: {
      email: 'agent@mediatec.org',
      role: 'agent',
    },
  }

  const setUser = userState => {
    dispatch(
      setUserState({
        userState: {
          ...userState,
        },
      }),
    )
    if (!roles.find(role => role === userRole)) {
      if (!(state.routing.location.pathname === '/dashboard')) {
        dispatch(push('/dashboard'))
      }
      return Promise.resolve(false)
    }
    return Promise.resolve(true)
  }

  switch (userRole) {
    case 'administrator':
      return setUser(users.administrator, userRole)

    case 'agent':
      return setUser(users.agent, userRole)

    default:
      const location = state.routing.location
      const from = location.pathname + location.search
      dispatch(_setFrom(from))
      dispatch(push('/login'))
      return Promise.reject()
  }
}

export function login(user_id, user_pwd, dispatch) {
  // Use Axios there to get User Auth Token with Basic Method Authentication
  dispatch(_loginAuthPending(''))
  return api
    .loginAuth({ user_id, user_pwd })
    .then(response => {
      const data = response.data
      const status = data.status
      const message = data.message
      if (status === 200) {
        const access_token_key = data.data.access_token_key
        window.localStorage.setItem('access_token_key', access_token_key)
        window.localStorage.setItem('app.Authorization', '')
        window.localStorage.setItem('app.Role', 'administrator')
        dispatch(_setHideLogin(true))
        dispatch(push('/dashboard'))
        notification.open({
          type: 'success',
          message: 'You have successfully logged in!',
          description:
            'Welcome to the Clean UI Admin Template. The Clean UI Admin Template is a complimentary template that empowers developers to make perfect looking and useful apps!',
        })
        dispatch(_loginAuthSuccess(response))
        return true
      } else {
        dispatch(_loginAuthFailure(message))
        dispatch(push('/login'))
        dispatch(_setFrom(''))
        return false
      }
    })
    .catch(error => {
      dispatch(_loginAuthFailure(error))
      dispatch(push('/login'))
      dispatch(_setFrom(''))
      return false
    })
}

export const logout = () => (dispatch, getState) => {
  dispatch(
    setUserState({
      userState: {
        email: '',
        role: '',
      },
    }),
  )
  window.localStorage.setItem('app.Authorization', '')
  window.localStorage.setItem('app.Role', '')
  dispatch(push('/login'))
}

const initialState = {
  // APP STATE
  from: '',
  isUpdatingContent: false,
  isLoading: false,
  activeDialog: '',
  dialogForms: {},
  submitForms: {
    pending: false,
    error: false,
    data: {},
  },
  isHideLogin: false,

  // LAYOUT STATE
  layoutState: {
    isMenuTop: false,
    menuMobileOpened: false,
    menuCollapsed: false,
    menuShadow: true,
    themeLight: true,
    squaredBorders: false,
    borderLess: true,
    fixedWidth: false,
    settingsOpened: false,
  },

  // USER STATE
  userState: {
    email: '',
    role: '',
  },
}

export default createReducer(
  {
    [_setFrom]: (state, from) => ({ ...state, from }),
    [_setLoading]: (state, isLoading) => ({ ...state, isLoading }),
    [_setHideLogin]: (state, isHideLogin) => ({ ...state, isHideLogin }),
    [setUpdatingContent]: (state, isUpdatingContent) => ({ ...state, isUpdatingContent }),
    [setUserState]: (state, { userState }) => ({ ...state, userState }),
    [setLayoutState]: (state, param) => {
      const layoutState = { ...state.layoutState, ...param }
      const newState = { ...state, layoutState }
      window.localStorage.setItem('app.layoutState', JSON.stringify(newState.layoutState))
      return newState
    },
    [setActiveDialog]: (state, activeDialog) => {
      const result = { ...state, activeDialog }
      if (activeDialog !== '') {
        const id = activeDialog
        result.dialogForms = { ...state.dialogForms, [id]: true }
      }
      return result
    },
    [deleteDialogForm]: (state, id) => {
      const dialogForms = { ...state.dialogForms }
      delete dialogForms[id]
      return { ...state, dialogForms }
    },
    [_loginAuthPending]: (state, pending) => {
      const submitForms = { ...state.submitForms, pending: true, error: false }
      return {
        ...state,
        submitForms,
      }
    },
    [_loginAuthSuccess]: (state, payload) => {
      const submitForms = { ...state.submitForms, pending: false, data: payload }
      return {
        ...state,
        submitForms,
      }
    },
    [_loginAuthFailure]: (state, error) => {
      const submitForms = { ...state.submitForms, pending: false, error: true }
      return {
        ...state,
        submitForms,
      }
    },
  },
  initialState,
)
