const { REACT_APP_API_URL: API_URL } = process.env;

const PAGE_LIMIT = 10;

const ROLES = {
  user: 'User',
  owner: 'Owner',
  admin: 'Admin',
};

export { API_URL, PAGE_LIMIT, ROLES };
