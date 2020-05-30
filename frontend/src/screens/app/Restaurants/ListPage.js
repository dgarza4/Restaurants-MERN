import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  TablePagination,
  Slider,
  Grid,
  Typography,
  Select,
  MenuItem,
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import VisibilityIcon from '@material-ui/icons/Visibility';
import MaterialTable, { MTableToolbar } from 'material-table';
import { makeStyles } from '@material-ui/core/styles';

import useApiRequests from './useApiRequests';

const useStyles = makeStyles((theme) => ({
  filterBar: {
    marginLeft: theme.spacing(2),
  },
}));

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 1,
    label: '1',
  },
  {
    value: 2,
    label: '2',
  },
  {
    value: 3,
    label: '3',
  },
  {
    value: 4,
    label: '4',
  },
  {
    value: 5,
    label: '5',
  },
];

export default () => {
  const history = useHistory();
  const classes = useStyles();
  const { authUser } = useSelector((state) => state.auth);

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
    averageRateFilter,
    setAverageRateFilter,
  } = useApiRequests();
  const ownersLookup = {};

  usersList.forEach((user) => {
    ownersLookup[user._id] = `${user.firstName} ${user.lastName}`;
  });

  const columnsArray = [
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
      lookup: ownersLookup,
      editComponent: (props) => (
        <Select
          labelId="owner-select-label"
          id="owner-select"
          value={
            typeof props.value === 'string'
              ? props.value
              : props.value
              ? props.value._id
              : null
          }
          onChange={(e) => props.onChange(e.target.value)}
        >
          {Object.keys(ownersLookup).map((ownerId) => (
            <MenuItem value={ownerId}>{ownersLookup[ownerId]}</MenuItem>
          ))}
        </Select>
      ),
      initialEditValue: (rowData) => (rowData.owner ? rowData.owner._id : null),
      filtering: false,
      sorting: false,
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
      filtering: false,
    },
    { title: 'Name', field: 'name' },
    {
      title: 'Reviews Count',
      field: 'reviewCount',
      editable: 'never',
    },
  ];

  if (authUser.role === 'owner') {
    columnsArray.splice(1, 1);
  }

  const [columns, setColumns] = useState(columnsArray);

  useEffect(() => {
    setColumns(columnsArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersList, authUser]);

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

  const editable = {};

  Object.assign(
    editable,
    authUser.role === 'admin' && {
      onRowUpdate: updateRestaurant,
      onRowDelete: deleteRestaurant,
      onRowAdd: addNewRestaurant,
    },
    authUser.role === 'owner' && {
      onRowAdd: addNewRestaurant,
    }
  );

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
            <div>
              <MTableToolbar {...props} />
              <Grid className={classes.filterBar} container spacing={3}>
                <Grid item sm={3}>
                  <Typography variant="h6" component="h6">
                    Filter by average rate:
                  </Typography>
                </Grid>
                <Grid item sm={3}>
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
                    marks={marks}
                  />
                </Grid>
              </Grid>
            </div>
          );
        },
      }}
      editable={editable}
    />
  );
};
