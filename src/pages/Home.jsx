import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/Store";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const { cart, addToCart, removeFromCart, clearCart } =
    useContext(CartContext);

  const addItemToCart = (item) => {
    addToCart(item);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setProducts(response.data);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterProducts = () => {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProducts(filtered);
    };

    filterProducts();
  }, [search, products]);

  return (
    <>
    <div className="w-full items-center px-20 mx-60 md:w-1/3">
      <input
        className="flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
    <div className="mx-auto grid w-full max-w-7xl items-center space-y-4 px-2 py-10 md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-4">
      {search === ""
        ? products.map((item) => <ProductCard key={item.id} i={item} />)
        : filteredProducts.map((item) => (
            <ProductCard  i={item} addItemToCart={addItemToCart} />
          ))}
    </div>
  </>

  );
};

export default Home;
