import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import request from '../../../utils/apiRequest';
import { enqueueSnackbar } from '../../../shared/Notifier/redux/actions';

import { updateProfileSuccess } from '../../auth/redux/actions';

export default () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const [data, setData] = useState({
    firstName: authUser.firstName,
    lastName: authUser.lastName,
    email: authUser.email,
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (data) => {
    setIsLoading(true);
    try {
      const result = await request('/profile', 'PUT', data, true);
      setData(result);
      dispatch(updateProfileSuccess(result));
      dispatch(enqueueSnackbar('Successfully updated', 'success'));
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, 'error'));
    }
    setIsLoading(false);
  };

  return {
    data,
    isLoading,
    updateProfile,
  };
};
