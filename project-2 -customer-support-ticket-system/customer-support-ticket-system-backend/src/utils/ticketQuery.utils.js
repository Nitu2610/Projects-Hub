const buildFilter = (query) => {
  const { status, priority, search } = query;

  const filter = {};

  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  if (search) {
    filter.title = {
      // look only in title field
      $regex: search, // to find the relative words
      $options: "i", // It makes the search case-insensitive.
    };
  }

  return filter;
};

const buildSort = (query) => {
  const { sortBy, order } = query;

  const sort = {};

  const allowedFields = ["createdAt", "updatedAt", "priority", "status"];

  if (allowedFields.includes(sortBy)) {
    sort[sortBy] = order === "desc" ? -1 : 1;
  }

  return sort;
};

const buildPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  return { skip, limit };
};

module.exports = {
  buildFilter,
  buildSort,
  buildPagination,
};
