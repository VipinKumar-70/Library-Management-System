import React, { createContext, useContext, useState } from "react";
import { fetchBooksApi, uploadBookApi } from "../api/book/uploadBook";

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch books list
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await fetchBooksApi();
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new book
  const addBook = async (formData) => {
    setLoading(true);
    try {
      const newBook = await uploadBookApi(formData);
      setBooks((prev) => [newBook, ...prev]);
      return newBook;
    } catch (error) {
      console.error("Failed to add book:", error);
      throw error;
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
        addBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBook = () => useContext(BookContext);
