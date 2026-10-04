import { useState } from "react";
import { Link } from "react-router";
import {
  FaHeart,
  FaShoppingCart,
  FaTrash,
  FaEye,
  FaStar,
  FaRegHeart,
} from "react-icons/fa";

const Wishlist = () => {
  // Mock wishlist data - Replace with actual API
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Premium Wireless Headphones",
      category: "Electronics",
      price: 2500,
      originalPrice: 3500,
      discount: 29,
      image: null,
      rating: 4.5,
      reviews: 128,
      inStock: true,
      addedDate: "2024-11-25",
    },
    {
      id: 2,
      name: "Smart Watch Series 7",
      category: "Wearables",
      price: 1200,
      originalPrice: 1800,
      discount: 33,
      image: null,
      rating: 4.8,
      reviews: 89,
      inStock: true,
      addedDate: "2024-11-24",
    },
    {
      id: 3,
      name: "Portable Bluetooth Speaker",
      category: "Audio",
      price: 1500,
      originalPrice: 2000,
      discount: 25,
      image: null,
      rating: 4.3,
      reviews: 56,
      inStock: false,
      addedDate: "2024-11-23",
    },
    {
      id: 4,
      name: "Laptop Backpack",
      category: "Accessories",
      price: 800,
      originalPrice: 1200,
      discount: 33,
      image: null,
      rating: 4.6,
      reviews: 234,
      inStock: true,
      addedDate: "2024-11-22",
    },
    {
      id: 5,
      name: "Mechanical Gaming Keyboard",
      category: "Gaming",
      price: 3500,
      originalPrice: 4500,
      discount: 22,
      image: null,
      rating: 4.9,
      reviews: 342,
      inStock: true,
      addedDate: "2024-11-20",
    },
  ]);

  const [selectedItems, setSelectedItems] = useState([]);

  const handleRemoveItem = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  const handleAddToCart = (item) => {
    // Add to cart logic here
    console.log("Adding to cart:", item);
  };

  const handleAddAllToCart = () => {
    const availableItems = wishlistItems.filter((item) => item.inStock);
    console.log("Adding all to cart:", availableItems);
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map((item) => item.id));
    }
  };

  const handleRemoveSelected = () => {
    setWishlistItems(
      wishlistItems.filter((item) => !selectedItems.includes(item.id)),
    );
    setSelectedItems([]);
  };

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <FaHeart className="text-primary-500" />
            My Wishlist
          </h1>
          <p className="text-sm text-primary-700 ">
            Your saved items for later
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="badge badge-neutral px-4 py-2 text-sm">
            {wishlistItems.length} items
          </div>
          {wishlistItems.length > 0 && (
            <button
              onClick={handleAddAllToCart}
              className="control flex items-center gap-2 px-4 py-2 transition-all duration-300 hover:scale-105 text-sm"
            >
              <FaShoppingCart size={16} />
              Add All to Cart
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {wishlistItems.length > 0 && (
        <div className="control border p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.length === wishlistItems.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-white0 rounded focus:ring-2 focus:ring-primary-500"
                />
                <span className="text-sm font-medium">Select All</span>
              </label>
              {selectedItems.length > 0 && (
                <span className="text-sm text-primary-700 ">
                  {selectedItems.length} selected
                </span>
              )}
            </div>
            {selectedItems.length > 0 && (
              <button
                onClick={handleRemoveSelected}
                className="btn btn-danger flex items-center gap-2 px-4 py-2 text-sm"
              >
                <FaTrash size={14} />
                Remove Selected
              </button>
            )}
          </div>
        </div>
      )}

      {/* Wishlist Items */}
      {wishlistItems.length === 0 ? (
        <div className="control border p-12 text-center">
          <FaRegHeart size={64} className="mx-auto text-primary-300  mb-4" />
          <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-primary-700  mb-6">
            Save items you love to buy them later
          </p>
          <Link to="/products" className="btn btn-primary inline-block px-6 py-3">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className={`card border ${
                selectedItems.includes(item.id)
                  ? "border-primary-500 shadow-lg"
                  : "border-border-color"
              } rounded-md overflow-hidden hover:shadow-lg transition-all duration-300 group`}
            >
              <div className="p-5">
                <div className="flex gap-4">
                  {/* Checkbox */}
                  <div className="flex items-start pt-1">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="w-4 h-4 text-white0 rounded focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Product Image */}
                  <div className="surface-muted flex h-24 w-24 shrink-0 items-center justify-center rounded-md transition-transform duration-300 group-hover:scale-105">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <FaHeart className="text-primary-400 text-3xl" />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <Link
                          to={`/products/${item.id}`}
                          className="font-semibold hover:text-white0 transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-primary-600  mt-1">
                          {item.category}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50  rounded-md transition-colors duration-300"
                        title="Remove from wishlist"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-500" size={14} />
                        <span className="text-sm font-medium">
                          {item.rating}
                        </span>
                      </div>
                      <span className="text-xs text-primary-600">
                        ({item.reviews} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl font-bold text-white0">
                        ৳{item.price}
                      </span>
                      {item.originalPrice > item.price && (
                        <>
                          <span className="text-sm text-primary-600 line-through">
                            ৳{item.originalPrice}
                          </span>
                          <span className="text-xs font-semibold text-green-600 bg-green-50  px-2 py-1 rounded">
                            {item.discount}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="mb-3">
                      {item.inStock ? (
                        <span className="text-xs font-medium text-green-600 bg-green-50  px-2 py-1 rounded">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-red-600 bg-red-50  px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 text-sm ${
                          item.inStock
                            ? "bg-card-bg  hover:scale-105"
                            : "bg-primary-200  text-primary-600 cursor-not-allowed"
                        }`}
                      >
                        <FaShoppingCart size={14} />
                        Add to Cart
                      </button>
                      <Link
                        to={`/products/${item.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-100  text-primary-800  rounded-md hover:bg-primary-300  transition-all duration-300 text-sm hover:scale-105"
                      >
                        <FaEye size={14} />
                        View
                      </Link>
                    </div>

                    {/* Added Date */}
                    <p className="text-xs text-primary-600  mt-3">
                      Added on{" "}
                      {new Date(item.addedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {wishlistItems.length > 0 && (
        <div className="surface border border-border-color rounded-lg p-6">
          <h2 className="text-lg font-bold mb-2">💡 You might also like</h2>
          <p className="text-sm text-primary-700  mb-4">
            Based on your wishlist, we recommend checking out our latest deals
          </p>
          <Link
            to="/products?sort=trending"
            className="control inline-block px-6 py-2 transition-all duration-300 text-sm font-medium"
          >
            Explore Recommendations
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
