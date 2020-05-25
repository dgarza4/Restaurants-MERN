function listWhere(filters = {}) {
  const where = {};

  Object.keys(filters).forEach((filterName) => {
    where[filterName] = filters[filterName];
  });

  return where;
}

function listSort(sorts) {
  return sorts.map((sort) => sort.split(' '));
}

function getCount(model, where = {}) {
  return model.count(where);
}

module.exports = {
  listWhere,
  listSort,
  getCount,
};
