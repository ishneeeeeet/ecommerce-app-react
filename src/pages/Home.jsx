import React, { useEffect, useReducer, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/Store";
import ProductCard from "../components/ProductCard";

// Initial state for the component
const initialState = {
  products: [],                 // All products fetched from the API
  filteredProducts: [],         // Products filtered based on search, category, price range, and sorting
  search: "",                   // Search query entered by the user
  selectedCategory: "All",      // Currently selected category
  isLoading: true,              // Loading state for API call
  error: null,                  // Error state if API call fails
  minPrice: "",                 // Minimum price for price range filter
  maxPrice: "",                 // Maximum price for price range filter
  sortOption: "default",        // Selected sorting option
};

// Reducer function to manage state updates
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload, isLoading: false };
    case "SET_FILTERED_PRODUCTS":
      return { ...state, filteredProducts: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_PRICE_RANGE":
      return {
        ...state,
        minPrice: action.payload.minPrice,
        maxPrice: action.payload.maxPrice,
      };
    case "SET_SORT_OPTION":
      return { ...state, sortOption: action.payload };
    default:
      return state;
  }
};

// Component for rendering a category item
const Category = ({ category, selectedCategory, handleCategoryChange }) => (
  <li
    className={selectedCategory === category ? "active" : ""}
    onClick={() => handleCategoryChange(category)}
  >
    {category}
  </li>
);

// Home component, the main component for displaying products and managing state
const Home = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cart, addToCart, removeFromCart, clearCart } = useContext(CartContext);

  const addItemToCart = (item) => {
    addToCart(item);
  };

  const handleCategoryChange = (category) => {
    dispatch({ type: "SET_SELECTED_CATEGORY", payload: category });
  };

  const handlePriceRangeChange = (event) => {
    const { name, value } = event.target;
    dispatch({ type: "SET_PRICE_RANGE", payload: { ...state, [name]: value } });
  };

  const handleSortOptionChange = (event) => {
    const { value } = event.target;
    dispatch({ type: "SET_SORT_OPTION", payload: value });
  };

  // Function to fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://fakestoreapi.com/products");
      dispatch({ type: "SET_PRODUCTS", payload: response.data });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Error fetching products" });
    }
  };

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Effect that runs whenever there is a change in the state dependencies (products, category, search, price range, sorting)
  useEffect(() => {
    let filtered = state.products;

    // Apply category filter
    if (state.selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === state.selectedCategory
      );
    }

    // Apply search filter
    if (state.search) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(state.search.toLowerCase())
      );
    }

    // Apply minimum price filter
    if (state.minPrice) {
      filtered = filtered.filter(
        (product) => parseFloat(product.price) >= parseFloat(state.minPrice)
      );
    }

    // Apply maximum price filter
    if (state.maxPrice) {
      filtered = filtered.filter(
        (product) => parseFloat(product.price) <= parseFloat(state.maxPrice)
      );
    }

    // Sort products based on the selected sort option
    switch (state.sortOption) {
      case "price-low-to-high":
        filtered = filtered.sort(
          (a, b) => parseFloat(a.price) - parseFloat(b.price)
        );
        break;
      case "price-high-to-low":
        filtered = filtered.sort(
          (a, b) => parseFloat(b.price) - parseFloat(a.price)
        );
        break;
      default:
        // No sorting or default sorting
        break;
    }

    // Update the filtered products in the state
    dispatch({ type: "SET_FILTERED_PRODUCTS", payload: filtered });
  }, [
    state.products,
    state.selectedCategory,
    state.search,
    state.minPrice,
    state.maxPrice,
    state.sortOption,
  ]);

  return (
    <>
      {/* Search input field */}
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

      {/* Main content grid */}
      <div className="mx-auto grid w-full max-w-7xl items-center space-y-4 px-2 py-10 md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-4">
        {/* Sidebar for filtering options */}
        <div>
          <h2>Categories:</h2>
          <ul>
            {/* Render a Category component for each category */}
            <Category
              category="All"
              selectedCategory={state.selectedCategory}
              handleCategoryChange={handleCategoryChange}
            />
            <Category
              category="men's clothing"
              selectedCategory={state.selectedCategory}
              handleCategoryChange={handleCategoryChange}
            />
            <Category
              category="jewelery"
              selectedCategory={state.selectedCategory}
              handleCategoryChange={handleCategoryChange}
            />
            <Category
              category="electronics"
              selectedCategory={state.selectedCategory}
              handleCategoryChange={handleCategoryChange}
            />
            <Category
              category="women's clothing"
              selectedCategory={state.selectedCategory}
              handleCategoryChange={handleCategoryChange}
            />
          </ul>
          <div>
            <h2>Price Range:</h2>
            {/* Input fields for minimum and maximum price */}
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={state.minPrice}
              onChange={handlePriceRangeChange}
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={state.maxPrice}
              onChange={handlePriceRangeChange}
            />
          </div>
          <div>
            <h2>Sort By:</h2>
            {/* Dropdown for selecting the sort option */}
            <select
              value={state.sortOption}
              onChange={handleSortOptionChange}
            >
              <option value="default">Default</option>
              <option value="price-low-to-high">Price: Low to High</option>
              <option value="price-high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Display products */}
        {state.isLoading ? (
          <p>Loading...</p>
        ) : state.error ? (
          <p>Error: {state.error}</p>
        ) : state.filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          // Render ProductCard component for each product
          state.filteredProducts.map((item) => (
            <ProductCard
              key={item.id}
              i={item}
              addItemToCart={() => addItemToCart(item)}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Home;
