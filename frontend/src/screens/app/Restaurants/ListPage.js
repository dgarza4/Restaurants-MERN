import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import MaterialTable from 'material-table';
import request from '../../../utils/apiRequest';
import { enqueueSnackbar } from '../../../shared/Notifier/redux/actions';

const columns = [
  { title: 'Name', field: 'name' },
  { title: 'Owner', field: 'owner' },
];

export default () => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const listRestaurants = async () => {
    // const requestData = {
    //   skip: action.payload.skip,
    //   limit: action.payload.limit,
    //   filters: action.payload.filters,
    //   sorts: action.payload.sorts,
    // };
    const requestData = {};
    try {
      setIsLoading(true);
      const { result } = await request(
        '/restaurants',
        'GET',
        requestData,
        true
      );
      setList(result);
      setIsLoading(false);
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, 'error'));
    }
  };

  const addNewRestaurant = async (data) => {
    try {
      setIsLoading(true);
      const data = await request('/restaurants', 'POST', data, true);
      setList([...list, data]);
      setIsLoading(false);
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, 'error'));
    }
  };

  const updateRestaurant = async (newData, oldData) => {
    try {
      setIsLoading(true);
      const data = await request(
        `/restaurants/${oldData._id}`,
        'PUT',
        { ...oldData, ...newData },
        true
      );
      setIsLoading(false);
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, 'error'));
    }
  };

  const deleteRestaurant = async (oldData) => {
    try {
      setIsLoading(true);
      const data = await request(
        `/restaurants/${oldData._id}`,
        'DELETE',
        null,
        true
      );
      setIsLoading(false);
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, 'error'));
    }
  };

  useEffect(() => {
    listRestaurants();
  }, []);

  return (
    <MaterialTable
      columns={columns}
      data={list}
      title="Restaurants List"
      editable={{
        onRowAdd: (newData) => {
          addNewRestaurant(newData);
        },
        onRowUpdate: (newData, oldData) => {
          updateRestaurant(newData, oldData);
        },
        onRowDelete: (oldData) => {
          deleteRestaurant(oldData);
        },
      }}
    />
  );
};
