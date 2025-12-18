import API from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { handleApiError } from "../utils/apiError";

// BOOKS
export const getBooks = async () => {
  try {
    const res = await API.get(API_ENDPOINTS.BOOKS.GET_ALL);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const addBook = async (data) => {
  try {
    const res = await API.post(API_ENDPOINTS.BOOKS.CREATE, data);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateBook = async (book) => {
  try {
    const res = await API.put(API_ENDPOINTS.BOOKS.UPDATE(book.id), book);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteBook = async (id) => {
  try {
    const res = await API.delete(API_ENDPOINTS.BOOKS.DELETE(id));
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// MEMBERS
export const getMembers = async () => {
  try {
    const res = await API.get(API_ENDPOINTS.MEMBERS.GET_ALL);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const addMember = async (data) => {
  try {
    const res = await API.post(API_ENDPOINTS.MEMBERS.CREATE, data);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateMember = async (member) => {
  try {
    const res = await API.put(API_ENDPOINTS.MEMBERS.UPDATE(member.id), member);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteMember = async (id) => {
  try {
    const res = await API.delete(API_ENDPOINTS.MEMBERS.DELETE(id));
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// TRANSACTIONS
export const borrowBook = async (payload) => {
  try {
    const res = await API.post(API_ENDPOINTS.TRANSACTIONS.BORROW, payload);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const returnBook = async (payload) => {
  try {
    const res = await API.post(API_ENDPOINTS.TRANSACTIONS.RETURN, payload);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getBorrowedBooks = async (memberId) => {
  try {
    const res = await API.get(
      API_ENDPOINTS.TRANSACTIONS.BORROWED_BY_MEMBER(memberId)
    );
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
