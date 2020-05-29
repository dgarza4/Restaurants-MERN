import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TablePagination, Slider, Box, Typography } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import VisibilityIcon from '@material-ui/icons/Visibility';
import MaterialTable from 'material-table';

import useApiRequests from './useApiRequests';

export default () => {
  const history = useHistory();
  const { authUser } = useSelector((state) => state.auth);
  const [averageRateFilter, setAverageRateFilter] = useState([0, 5]);
  const {
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
    setFilters,
    setSorts,
  } = useApiRequests();

  const usersLookup = {};

  usersList.forEach((user) => {
    usersLookup[user._id] = `${user.firstName} ${user.lastName}`;
  });

  const columns = [
    { title: 'Name', field: 'name' },
    {
      title: 'Owner',
      field: 'owner',
      render: (rowData) =>
        rowData.owner ? (
          <div>
            {rowData.owner.firstName} {rowData.owner.lastName}
          </div>
        ) : (
          '-'
        ),
      lookup: usersLookup,
      initialEditValue: (rowData) => (rowData.owner ? rowData.owner._id : null),
      filtering: authUser.role === 'admin',
    },
    {
      title: 'Average Rate',
      field: 'averageRate',
      render: (rowData) => (
        <Rating
          name="averageRate"
          defaultValue={rowData ? rowData.averageRate : 0}
          value={rowData ? rowData.averageRate : 0}
          precision={0.5}
          readOnly
          emptyIcon={<StarBorderIcon fontSize="inherit" />}
        />
      ),
      editable: 'never',
    },
    {
      title: 'Reviews Count',
      field: 'reviewCount',
      editable: 'never',
    },
  ];

  const handleFilterChange = (filters) => {
    const data = {};
    filters.forEach((el) => {
      data[el.column.field] = el.value;
    });

    setFilters(data);
  };

  const handleOrderChange = (columnId, dir) => {
    if (columnId < 0) return;

    setSorts([`${columns[columnId].field} ${dir}`]);
  };

  return (
    <MaterialTable
      columns={columns}
      data={list}
      title="Restaurants List"
      isLoading={isLoading}
      options={{
        pageSize: perPage,
        filtering: true,
        search: false,
        debounceInterval: 500,
      }}
      actions={[
        {
          icon: () => <VisibilityIcon />,
          tooltip: 'View Details',
          onClick: (event, rowData) => {
            history.push(`/restaurants/${rowData._id}`);
          },
        },
      ]}
      onFilterChange={handleFilterChange}
      onOrderChange={handleOrderChange}
      components={{
        Pagination: (props) => (
          <TablePagination
            {...props}
            onChangePage={(e, page) => setPageNum(page)}
            onChangeRowsPerPage={(e) => setPerPage(e.target.value)}
            count={total}
            page={pageNum}
            rowsPerPage={perPage}
          />
        ),
        Toolbar: (props) => {
          return (
            <Box display="flex">
              <Typography variant="h5" component="h6">
                Filter by average rate:
              </Typography>
              <Slider
                min={0}
                max={5}
                step={0.1}
                value={averageRateFilter}
                onChange={(event, newValue) => {
                  setAverageRateFilter(newValue);
                }}
                valueLabelDisplay="auto"
                aria-labelledby="rate-range-slider"
              />
            </Box>
          );
        },
      }}
      editable={{
        onRowAdd: addNewRestaurant,
        onRowUpdate: updateRestaurant,
        onRowDelete: deleteRestaurant,
      }}
    />
  );
};
