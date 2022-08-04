import { createContext, useReducer } from 'react';
import githubReducer from './GithubReducer';

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

/* 
  provider takes in props –
  take the children which is
  whatever we suround with the provider
*/
export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
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

  const setLoading = () => dispatch({ type: 'SET_LOADING' });

  const clearSearch = () => dispatch({ type: 'CLEAR_SEARCH' });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        user: state.user,
        searchUsers,
        getUser,
        clearSearch,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
