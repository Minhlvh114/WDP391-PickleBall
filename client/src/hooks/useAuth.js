import { createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useLocalStorage } from './useLocalStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // const [user, setUser] = useLocalStorage('user', null);
  const [user, setUser] = useLocalStorage('user', {isAdmin: true});
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.firstLogin) {
      navigate('/change-password', { replace: true });
    }
  }, [user, navigate]);

  const login = useCallback(
    async (data) => {
      setUser(data);
      if (data.firstLogin) {
        navigate('/change-password', { replace: true });
      } else if (data.isAdmin) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/books', { replace: true });
      }
    },
    [setUser, navigate]
  );

  const logout = useCallback(() => {
    setUser(null);
    navigate('/login', { replace: true });
  }, [setUser, navigate]);

  const updateUser = useCallback(
    (updatedData) => {
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedData,
      }));
      if (updatedData.firstLogin === false) {
        navigate('/books', { replace: true });
      }
    },
    [setUser, navigate]
  );

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      updateUser,
    }),
    [user, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
