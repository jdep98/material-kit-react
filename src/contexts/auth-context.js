import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import jwt_decode from "jwt-decode";


const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);  

const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = window.sessionStorage.getItem('authenticated') === 'true';
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {      
      const token = window.sessionStorage.getItem('token');
      if (token) {
        try {
          const user = jwt_decode(token);
          dispatch({
            type: HANDLERS.INITIALIZE,
            payload: user
          });
        } catch (error) {
          console.error('Error decoding the token:', error);
        }
      }
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
};

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );  

  const signIn = async (email, password) => {
    try {
        // Hacer una petición POST al endpoint de inicio de sesión
        const response = await axios.post(process.env.NEXT_PUBLIC_URL_HOST + '/login', {
            email,
            password
        });

        // Si la autenticación es exitosa, almacenar el token y los datos del usuario
        const { token, user } = response.data;

        // Almacenar el token en sessionStorage (opcional)
        window.sessionStorage.setItem('token', token);

        // Almacenar el estado de autenticación
        window.sessionStorage.setItem('authenticated', 'true');     

        // Despachar la acción con los datos del usuario
        dispatch({
            type: HANDLERS.SIGN_IN,
            payload: user
        });

    } catch (error) {
        // Manejar errores, por ejemplo, si las credenciales son incorrectas
        if (error.response && error.response.status === 401) {
            throw new Error('Please check your email and password');
        } else {
            console.error('Error during sign in:', error);
            throw new Error('Error during sign in');
        }
    }
};

  const signUp = async (email, name, password) => {
    throw new Error('Sign up is not implemented');
  };

  const signOut = () => {
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,        
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
