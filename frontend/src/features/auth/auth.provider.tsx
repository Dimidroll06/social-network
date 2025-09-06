import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import { useGetMeQuery } from './auth.api';
import { setUser, setAuthenticated, setLoading } from './auth.slice';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, error } = useGetMeQuery();

  useEffect(() => {
    console.log(data, isLoading, error);
    if (!isLoading) {
      if (!error && data) {
        dispatch(setUser(data));
        dispatch(setAuthenticated(true));
      } else {
        dispatch(setUser(null));
        dispatch(setAuthenticated(false));
      }
      dispatch(setLoading(false));
    }
  }, [data, isLoading, error, dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
