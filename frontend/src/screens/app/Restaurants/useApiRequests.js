import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import request from '../../../utils/apiRequest';
import { enqueueSnackbar } from '../../../shared/Notifier/redux/actions';

export default () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const [list, setList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState({});
  const [sorts, setSorts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [averageRateFilter, setAverageRateFilter] = useState([0, 5]);

  const listRestaurants = async (
    page = pageNum,
    limit = perPage,
    newFilters = filters,
    newSorts = sorts
  ) => {
    const filtersData = {
      averageRate: { $gte: averageRateFilter[0], $lte: averageRateFilter[1] },
    };

    Object.assign(
      filtersData,
      newFilters.name && {
        name: { $regex: filters.name, $options: 'i' },
      },
      newFilters.owner && {
        owner: { $in: filters.owner },
      },
      newFilters.reviewCount && { reviewCount: filters.reviewCount }
    );

    const requestData = {
      skip: page * limit,
      limit,
      filters: filtersData,
      sorts: newSorts,
    };
    setIsLoading(true);
    try {
      const { data, total } = await request(
        '/restaurants',
        'GET',
        requestData,
        true
      );
      setList(data);
      setTotal(total);
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, 'error'));
    }
    setIsLoading(false);
  };

  const listUsers = async () => {
    try {
      const { data } = await request(
        '/users',
        'GET',
        { limit: 1000, filters: { role: 'owner' } },
        true
      );
      setUsersList(data);
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, 'error'));
    }
  };

  const addNewRestaurant = (newData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await request('/restaurants', 'POST', newData, true);
        await listRestaurants();
        resolve(result);
      } catch (err) {
        dispatch(enqueueSnackbar(err.message, 'error'));
        reject();
      }
    });
  };

  const updateRestaurant = (newData, oldData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await request(
          `/restaurants/${oldData._id}`,
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

  const deleteRestaurant = (oldData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await request(
          `/restaurants/${oldData._id}`,
          'DELETE',
          null,
          true
        );
        await listRestaurants();
        resolve(result);
      } catch (err) {
        dispatch(enqueueSnackbar(err.message, 'error'));
        reject();
      }
    });
  };

  useEffect(() => {
    listRestaurants(pageNum, perPage, filters, sorts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage, pageNum, filters, sorts, averageRateFilter]);

  useEffect(() => {
    if (authUser.role === 'admin') {
      listUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    listRestaurants,
    addNewRestaurant,
    updateRestaurant,
    deleteRestaurant,

    usersList,
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

    averageRateFilter,
    setAverageRateFilter,
  };
};
