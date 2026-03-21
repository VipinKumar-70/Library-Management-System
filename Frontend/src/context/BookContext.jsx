import React, { createContext, useContext, useState, useCallback } from "react";
import {
  fetchBooksApi,
  uploadBookApi,
  deleteBookApi,
  updateBookApi,
} from "../api/book/BookApi";

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ FIXED (no re-render loop)
  const fetchBooks = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const data = await fetchBooksApi(pageNum);
      setBooks(data.books || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBook = async (id) => {
    try {
      await deleteBookApi(id);
      fetchBooks(page);
    } catch (err) {
      console.error(err);
    }
  };

  const updateBook = async (id, data) => {
    try {
      await updateBookApi(id, data);
      fetchBooks(page);
    } catch (err) {
      console.error(err);
    }
  };

  const addBook = async (formData) => {
    setLoading(true);
    try {
      await uploadBookApi(formData);
      fetchBooks(page);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookContext.Provider
      value={{
        books,
        loading,
        fetchBooks,
        deleteBook,
        updateBook,
        addBook,
        page,
        totalPages,
        setPage,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBook = () => useContext(BookContext);
