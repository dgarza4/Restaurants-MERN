import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  TablePagination,
  Box,
  Typography,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
} from '@material-ui/core';
import ReplyIcon from '@material-ui/icons/Reply';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import MaterialTable, { MTableToolbar } from 'material-table';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
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
  const [selected, setSelected] = useState(null);
  const [columns, setColumns] = useState([
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
          value={rowData ? rowData.rate : 0}
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
      editable: 'never',
      filtering: false,
    },
    {
      title: 'Reply',
      field: 'reply',
      editable: authUser.role === 'admin' ? 'always' : 'never',
    },
  ]);

  const {
    addNewReview,
    updateReview,
    deleteReview,
    replyToComment,
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
    reportData,
  } = useApiRequests();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const editable = {};

  Object.assign(
    editable,
    authUser.role !== 'owner' && { onRowAdd: addNewReview },
    authUser.role === 'admin' && { onRowUpdate: updateReview },
    authUser.role === 'admin' && {
      onRowDelete: deleteReview,
    }
  );

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

  const actions = [];

  if (authUser.role !== 'user') {
    actions.push((rowData) => ({
      icon: () => <ReplyIcon />,
      tooltip: 'Reply to comment',
      onClick: (event, rowData) => {
        handleClickOpen();
        setSelected(rowData._id);
      },
      disabled: !!rowData.reply,
    }));
  }

  const handleFormSubmit = ({ reply }) => {
    replyToComment(selected, reply);
    handleClose();
  };

  const renderModal = () => {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        aria-labelledby="form-dialog-title"
      >
        <Formik
          initialValues={{ reply: '' }}
          validate={(values) => {
            const errors = {};
            if (!values.reply) {
              errors.reply = 'Reply text can not be blank';
            }

            return errors;
          }}
          onSubmit={handleFormSubmit}
        >
          {({ submitForm, isSubmitting }) => (
            <>
              <DialogTitle id="form-dialog-title">Reply</DialogTitle>
              <DialogContent>
                <Form noValidate>
                  <Field
                    component={TextField}
                    autoComplete="reply"
                    name="reply"
                    required
                    fullWidth
                    id="reply"
                    label="reply"
                    autoFocus
                    disable={false}
                  />
                </Form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="default">
                  Cancel
                </Button>
                <Button onClick={submitForm} color="primary">
                  Save
                </Button>
              </DialogActions>
            </>
          )}
        </Formik>
      </Dialog>
    );
  };

  return (
    <>
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
        actions={actions}
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
                    flexDirection="row"
                    justifyContent="space-around"
                  >
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
                        precision={0.1}
                        emptyIcon={<StarBorderIcon fontSize="inherit" />}
                      />{' '}
                      / {restaurant.reviewCount}
                    </Box>
                    <Box>
                      {reportData.max && (
                        <Box display="flex" alignItems="center">
                          <Box width={140}>Highest rated review:</Box>
                          <Rating
                            name="rate"
                            defaultValue={reportData.max.rate || 0}
                            precision={0.1}
                            readOnly
                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                          />
                          <Box>({reportData.max.rate})</Box>
                        </Box>
                      )}
                      {reportData.min && (
                        <Box display="flex" alignItems="center">
                          <Box width={140}>Lowest rated review:</Box>
                          <Rating
                            name="rate"
                            defaultValue={reportData.min.rate || 0}
                            precision={0.1}
                            readOnly
                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                          />
                          <Box>({reportData.min.rate})</Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
              </div>
            );
          },
        }}
        editable={editable}
      />
      {renderModal()}
    </>
  );
};
