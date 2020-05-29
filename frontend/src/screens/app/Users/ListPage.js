import React from 'react';
import { TablePagination } from '@material-ui/core';
import MaterialTable from 'material-table';

import useApiRequests from './useApiRequests';

const columns = [
  { title: 'First Name', field: 'firstName' },
  { title: 'Last Name', field: 'lastName' },
  { title: 'Email', field: 'email' },
  {
    title: 'Password',
    field: 'password',
    render: (rowData) => <div style={{ opacity: 0.5 }}>******</div>,
    filtering: false,
  },
  {
    title: 'Role',
    field: 'role',
    lookup: { user: 'User', owner: 'Owner', admin: 'Admin' },
    initialEditValue: 'user',
  },
];

export default () => {
  const {
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
    setFilters,
    setSorts,
  } = useApiRequests();

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
      title="Users List"
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
      }}
      editable={{
        onRowAdd: (newData) => {
          return addNewUser(newData);
        },
        onRowUpdate: (newData, oldData) => {
          return updateUser(newData, oldData);
        },
        onRowDelete: (oldData) => {
          return deleteUser(oldData);
        },
      }}
    />
  );
};
