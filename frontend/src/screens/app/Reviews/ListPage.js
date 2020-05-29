import React from 'react';
import { useSelector } from 'react-redux';
import { TablePagination, Box, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import MaterialTable, { MTableToolbar } from 'material-table';

import useApiRequests from './useApiRequests';

const useStyles = makeStyles((theme) =>
  createStyles({
    customToolbar: {
      paddingLeft: theme.spacing(3),
    },
  })
);

export default () => {
  const { authUser } = useSelector((state) => state.auth);
  const classes = useStyles();

  const {
    addNewReview,
    updateReview,
    deleteReview,
    list,
    total,
    isLoading,
    perPage,
    setPerPage,
    pageNum,
    setPageNum,
    setFilters,
    setSorts,
    restaurant,
  } = useApiRequests();

  const editable = {};

  Object.assign(
    editable,
    authUser.role !== 'owner' && { onRowAdd: addNewReview },
    authUser.role !== 'user' && { onRowUpdate: updateReview },
    authUser.role === 'admin' && {
      onRowDelete: deleteReview,
    }
  );

  const columns = [
    {
      title: 'Visit Date',
      field: 'date',
      editComponent: (props) => (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            id="date-picker-inline"
            value={props.value}
            onChange={props.onChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            maxDate={new Date()}
          />
        </MuiPickersUtilsProvider>
      ),
      initialEditValue: new Date(),
      type: 'date',
      filtering: false,
    },
    {
      title: 'Rate',
      field: 'rate',
      render: (rowData) => (
        <Rating
          name="rate"
          defaultValue={rowData ? rowData.rate : 0}
          precision={0.5}
          readOnly
          emptyIcon={<StarBorderIcon fontSize="inherit" />}
        />
      ),
      editComponent: (props) => (
        <Rating
          name="rate"
          value={props.value}
          onChange={(e) => {
            e.preventDefault();
            props.onChange(e.target.value);
          }}
          precision={0.5}
          emptyIcon={<StarBorderIcon fontSize="inherit" />}
        />
      ),
      initialEditValue: 0,
      filtering: false,
    },
    {
      title: 'Comment',
      field: 'comment',
    },
    {
      title: 'Commented by',
      field: 'commentedBy',
      render: (rowData) =>
        rowData && rowData.user ? (
          <div>
            {rowData.user.firstName} {rowData.user.lastName}
          </div>
        ) : (
          ''
        ),
      editable: false,
    },
    {
      title: 'Reply',
      field: 'reply',
      editable: authUser.role === 'admin',
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
      title={`Detail view of ${restaurant.name || ''}`}
      isLoading={isLoading}
      options={{
        pageSize: perPage,
        filtering: true,
        search: false,
        debounceInterval: 500,
      }}
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
              {!!restaurant.reviewCount && (
                <Box
                  display="flex"
                  alignItems="center"
                  className={classes.customToolbar}
                >
                  <Typography variant="h5" component="h6">
                    Average rate ({restaurant.averageRate}):
                  </Typography>
                  <Rating
                    name="rate"
                    defaultValue={restaurant.averageRate}
                    readOnly
                    precision={0.01}
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                  />{' '}
                  / {restaurant.reviewCount}
                </Box>
              )}
            </div>
          );
        },
      }}
      editable={editable}
    />
  );
};
