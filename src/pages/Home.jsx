import React, { useEffect, useReducer, useState, useContext, useCallback } from "react";
import axios from "axios";
import { CartContext } from "../context/Store";
import ProductCard from "../components/ProductCard";
import { debounce } from "lodash";

const initialState = {
  products: [],
  filteredProducts: [],
  search: "",
  selectedCategory: "All",
  isLoading: true,
  error: null,
  minPrice: "",
  maxPrice: "",
  sortOption: "default",
  page: 1,
  pageSize: 12,
  totalPages: 1,
};

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
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };
    default:
      return state;
  }
};

const Category = ({ category, selectedCategory, handleCategoryChange }) => (
  <li
    className={selectedCategory === category ? "active" : ""}
    onClick={() => handleCategoryChange(category)}
  >
    {category}
  </li>
);

const Home = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cart, addToCart, removeFromCart, clearCart } = useContext(CartContext);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const addItemToCart = (item) => {
    addToCart(item);
  };

  const handleCategoryChange = useCallback(
    (category) => {
      dispatch({ type: "SET_SELECTED_CATEGORY", payload: category });
    },
    []
  );

  const handlePriceRangeChange = (event) => {
    const { name, value } = event.target;
    dispatch({ type: "SET_PRICE_RANGE", payload: { ...state, [name]: value } });
  };

  const handleSortOptionChange = (event) => {
    const { value } = event.target;
    dispatch({ type: "SET_SORT_OPTION", payload: value });
  };

  const handlePageChange = (page) => {
    dispatch({ type: "SET_PAGE", payload: page });
  };

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get("https://fakestoreapi.com/products");
      dispatch({ type: "SET_PRODUCTS", payload: response.data });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Error fetching products" });
    }
  }, []);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const applyFilters = useCallback(
    debounce(() => {
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
  
      if (state.minPrice) {
        filtered = filtered.filter(
          (product) => parseFloat(product.price) >= parseFloat(state.minPrice)
        );
      }
  
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
  
      dispatch({ type: "SET_FILTERED_PRODUCTS", payload: filtered });
    }, 300),
    [
      state.products,
      state.selectedCategory,
      state.search,
      state.minPrice,
      state.maxPrice,
      state.sortOption,
    ]
  );
  

  

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <>
      <div className="w-full items-center px-20 mx-60 md:w-1/3">
        <input
          className="flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          type="text"
          placeholder="Search products..."
          value={state.search}
          onChange={(e) => setDebouncedSearch(e.target.value)}
        />
      </div>
      <div className="mx-auto grid w-full max-w-7xl items-center space-y-4 px-2 py-10 md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-4">
        <div>
          <h2>Categories:</h2>
          <ul>
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
            <select value={state.sortOption} onChange={handleSortOptionChange}>
              <option value="default">Default</option>
              <option value="price-low-to-high">Price: Low to High</option>
              <option value="price-high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>
        {state.isLoading ? (
          <p>Loading...</p>
        ) : state.error ? (
          <p>Error: {state.error}</p>
        ) : state.filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
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
