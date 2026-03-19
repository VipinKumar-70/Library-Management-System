import React from "react";
import { useContext, createContext, useEffect, useState } from "react";
import { uploadbookApi } from "../api/book/uploadBookApi";

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const addBook = async () => {
    try {
      const data = await uploadbookApi(FormData);
      setBooks((prev) => [...prev, books]);
      return books;
    } catch (error) {
      console.error("Failed to add book:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    addBook();
  }, []);

  return (
    <BookContext.Provider value={{ books, setBooks, loading, addBook }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBook = () => useContext(BookContext);
