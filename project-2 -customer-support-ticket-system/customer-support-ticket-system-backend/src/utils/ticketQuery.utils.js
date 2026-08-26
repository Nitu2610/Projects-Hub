const mongoose=require("mongoose");

const buildFilter = (query, user) => {

  const userId =new mongoose.Types.ObjectId(user.id);
  const role = user.role;

  const { status, priority, search } = query;

  const filter = {};

  // Role-based ticket visibility
  if (role === "customer") filter.createdBy = userId;
  if (role === "agent") filter.assignedTo = userId;

  // Admin does not need an ownership filter.
  // Admin can see all tickets.

  // Common filters apply to all roles.

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

  const allowedFields = ["issueOccurredAt", "updatedAt", "priority", "status"];

  if (allowedFields.includes(sortBy)) {
    sort[sortBy] = order === "desc" ? -1 : 1;
  }

  return sort;
};

const buildPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 5, 1), 100);
  const skip = (page - 1) * limit;
  // client sends the page number and knowns the limit, so no need to resend it.
  return { skip, limit };
};

module.exports = {
  buildFilter,
  buildSort,
  buildPagination,
};
