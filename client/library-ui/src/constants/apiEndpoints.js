export const API_ENDPOINTS = {
  BOOKS: {
    GET_ALL: "/books",
    CREATE: "/books",
    UPDATE: (id) => `/books/${id}`,
    DELETE: (id) => `/books/${id}`,
  },

  MEMBERS: {
    GET_ALL: "/members",
    CREATE: "/members",
    UPDATE: (id) => `/members/${id}`,
    DELETE: (id) => `/members/${id}`,
  },

  TRANSACTIONS: {
    BORROW: "/borrow",
    RETURN: "/return",
    BORROWED_BY_MEMBER: (id) => `/borrowed/${id}`,
  },
};
