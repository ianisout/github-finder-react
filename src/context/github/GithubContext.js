import { createContext, useReducer } from 'react';
import githubReducer from './GithubReducer';

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

/* 
  provider takes in props –
  children, whatever we surround with the provider
*/
export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  // dispatch works like setWhateverState
  // dispatches action to the reducer
  const [state, dispatch] = useReducer(githubReducer, initialState);

  // Get initial users (testing purposes)
  // const fetchUsers = async () => {
  //   setLoading();

  //   const res = await fetch(`${GITHUB_URL}/users`, {
  //     // headers: {
  //     //   Authorization: `token ${GITHUB_TOKEN}`
  //     // }
  //   });

  const searchUsers = async (text) => {
    setLoading();

    const params = new URLSearchParams({ q: text });

    const res = await fetch(`${GITHUB_URL}/search/users?${params}`, {
      // headers: {
      //   Authorization: `token ${GITHUB_TOKEN}`
      // }
    });

    const { items } = await res.json();

    dispatch({
      type: 'GET_USERS',
      payload: items,
    });
  };

  const getUser = async (login) => {
    setLoading();

    const res = await fetch(`${GITHUB_URL}/users/${login}`);

    if (res.status === 404) {
      window.location = '/notfound'
    } else {
      const data = await res.json();
  
      dispatch({
        type: 'GET_USER',
        payload: data,
      });
    }
  };

  const getUserRepos = async (login) => {
    setLoading();

    const params = new URLSearchParams({
      sort: 'created',
      per_page: 10
    });

    const res = await fetch(`${GITHUB_URL}/users/${login}/repos?${params}`, {
      // headers: {
      //   Authorization: `token ${GITHUB_TOKEN}`
      // }
    });

    const data = await res.json();

    dispatch({
      type: 'GET_REPOS',
      payload: data,
    });
  };

  const setLoading = () => dispatch({ type: 'SET_LOADING' });

  const clearSearch = () => dispatch({ type: 'CLEAR_SEARCH' });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        user: state.user,
        repos: state.repos,
        searchUsers,
        getUser,
        clearSearch,
        getUserRepos
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
