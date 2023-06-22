import React, { useEffect, useReducer, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/Store";
import ProductCard from "../components/ProductCard";

const initialState = {
  products: [],
  filteredProducts: [],
  search: "",
  selectedCategory: "All",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "SET_FILTERED_PRODUCTS":
      return { ...state, filteredProducts: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    default:
      return state;
  }
};

const Home = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cart, addToCart, removeFromCart, clearCart } = useContext(CartContext);

  const addItemToCart = (item) => {
    addToCart(item);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        dispatch({ type: "SET_PRODUCTS", payload: response.data });
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterProducts = () => {
      let filtered = state.products;

      if (state.selectedCategory !== "All") {
        filtered = filtered.filter(
          (product) => product.category === state.selectedCategory
        );
      }

      if (state.search) {
        filtered = filtered.filter((product) =>
          product.title.toLowerCase().includes(state.search.toLowerCase())
        );
      }

      dispatch({ type: "SET_FILTERED_PRODUCTS", payload: filtered });
    };

    filterProducts();
  }, [state.search, state.selectedCategory, state.products]);

  const handleCategoryChange = (category) => {
    dispatch({ type: "SET_SELECTED_CATEGORY", payload: category });
  };

  const categories = [...new Set(state.products.map((product) => product.category))];

  return (
    <>
      <div className="w-full items-center px-20 mx-60 md:w-1/3">
        <input
          className="flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          type="text"
          placeholder="Search products..."
          value={state.search}
          onChange={(e) =>
            dispatch({ type: "SET_SEARCH", payload: e.target.value })
          }
        />
      </div>
      <div className="mx-auto grid w-full max-w-7xl items-center space-y-4 px-2 py-10 md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-4">
        <div>
          <h2>Categories:</h2>
          <ul>
            <li
              className={state.selectedCategory === "All" ? "active" : ""}
              onClick={() => handleCategoryChange("All")}
            >
              All
            </li>
            {categories.map((category) => (
              <li
                key={category}
                className={
                  state.selectedCategory === category ? "active" : ""
                }
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
        {state.search === ""
          ? state.filteredProducts.map((item) => (
              <ProductCard
                key={item.id}
                i={item}
                addItemToCart={() => addItemToCart(item)}
              />
            ))
          : state.filteredProducts.map((item) => (
              <ProductCard
                key={item.id}
                i={item}
                addItemToCart={() => addItemToCart(item)}
              />
            ))}
      </div>
    </>
  );
};

export default Home;
