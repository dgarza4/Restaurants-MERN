import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import request from '../../../utils/apiRequest';
import { enqueueSnackbar } from '../../../shared/Notifier/redux/actions';

export default () => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState({});
  const [sorts, setSorts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const listUsers = async (
    page = pageNum,
    limit = perPage,
    newFilters = filters,
    newSorts = sorts
  ) => {
    const filtersData = {};
    Object.assign(
      filtersData,
      newFilters.firstName && {
        firstName: { $regex: filters.firstName, $options: 'i' },
      },
      newFilters.lastName && {
        lastName: { $regex: filters.lastName, $options: 'i' },
      },
      newFilters.email && { email: { $regex: filters.email, $options: 'i' } },
      newFilters.role && { role: { $in: filters.role } }
    );

    const requestData = {
      skip: page * limit,
      limit,
      filters: filtersData,
      sorts: newSorts,
    };
    setIsLoading(true);
    try {
      const { data, total } = await request('/users', 'GET', requestData, true);
      setList(data);
      setTotal(total);
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, 'error'));
    }
    setIsLoading(false);
  };

  const addNewUser = (newData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await request('/users', 'POST', newData, true);
        await listUsers();
        resolve(result);
      } catch (err) {
        dispatch(enqueueSnackbar(err.message, 'error'));
        reject();
      }
    });
  };

  const updateUser = (newData, oldData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await request(
          `/users/${oldData._id}`,
          'PUT',
          { ...oldData, ...newData },
          true
        );
        setList(list.map((el) => (el._id === result._id ? result : el)));
        resolve(result);
      } catch (err) {
        dispatch(enqueueSnackbar(err.message, 'error'));
        reject();
      }
    });
  };

  const deleteUser = (oldData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await request(
          `/users/${oldData._id}`,
          'DELETE',
          null,
          true
        );
        await listUsers();
        resolve(result);
      } catch (err) {
        dispatch(enqueueSnackbar(err.message, 'error'));
        reject();
      }
    });
  };

  useEffect(() => {
    listUsers(pageNum, perPage, filters, sorts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage, pageNum, filters, sorts]);

  return {
    listUsers,
    addNewUser,
    updateUser,
    deleteUser,

    list,
    total,
    isLoading,

    perPage,
    setPerPage,

    pageNum,
    setPageNum,

    filters,
    setFilters,

    setSorts,
  };
};
