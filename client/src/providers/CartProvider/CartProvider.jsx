/* eslint-disable react-refresh/only-export-components */
import { createContext } from "react";
import Swal from "sweetalert2";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // Fetch products from localStorage using useQuery
  const { data: cartData = [], refetch } = useQuery({
    queryKey: ["cartProducts"],
    queryFn: async () => {
      // Fetch data from localStorage
      const storedProducts =
        JSON.parse(
          localStorage.getItem(import.meta.env.VITE_CART_NAME || "CART")
        ) || [];
      return storedProducts;
    },
    initialData: [], // Start with an empty array
  });

  //   Handle product add to cart
  const handleAddToCart = (selectedProduct) => {
    try {
      const existingCart = localStorage.getItem(
        import.meta.env.VITE_CART_NAME || "CART"
      );
      const cart = existingCart ? JSON.parse(existingCart) : [];

      cart.push(selectedProduct);
      localStorage.setItem(
        import.meta.env.VITE_CART_NAME || "CART",
        JSON.stringify(cart)
      );

      Swal.fire({
        title: "Product added to your cart successfully!",
        icon: "success",
        draggable: true,
      });
      refetch();
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed to add product to cart.",
        icon: "error",
        draggable: true,
      });
    }
  };

  // Handle product remove from cart by index
  const removeProduct = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this item from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const updatedCart = cartData.filter((_, i) => i !== index);
          localStorage.setItem(
            import.meta.env.VITE_CART_NAME || "CART",
            JSON.stringify(updatedCart)
          );

          // Update React Query cache immediately
          queryClient.setQueryData(["cartProducts"], updatedCart);

          Swal.fire({
            title: "Removed!",
            text: "Item has been removed from your cart.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: "Failed!",
            text: "Something went wrong while updating your cart.",
            icon: "error",
          });
        }
      }
    });
  };

  // Handle quantity increase
  const increaseQuantity = (index) => {
    try {
      // Create a deep copy of cartData
      const updatedCart = JSON.parse(JSON.stringify(cartData));
      const item = updatedCart[index];

      const maxAllowed = Math.min(
        item.productQuantity || 999,
        item.maxOrderLimit || 10
      );

      if (item.selectedQuantity < maxAllowed) {
        item.selectedQuantity += 1;
        localStorage.setItem(
          import.meta.env.VITE_CART_NAME || "CART",
          JSON.stringify(updatedCart)
        );

        // Update React Query cache immediately
        queryClient.setQueryData(["cartProducts"], updatedCart);
      } else {
        Swal.fire({
          title: "Maximum Quantity Reached",
          text: `Only ${maxAllowed} items can be ordered.`,
          icon: "warning",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed!",
        text: "Something went wrong while updating quantity.",
        icon: "error",
      });
    }
  };

  // Handle quantity decrease
  const decreaseQuantity = (index) => {
    try {
      // Create a deep copy of cartData
      const updatedCart = JSON.parse(JSON.stringify(cartData));
      const item = updatedCart[index];

      if (item.selectedQuantity > 1) {
        item.selectedQuantity -= 1;
        localStorage.setItem(
          import.meta.env.VITE_CART_NAME || "CART",
          JSON.stringify(updatedCart)
        );

        // Update React Query cache immediately
        queryClient.setQueryData(["cartProducts"], updatedCart);
      } else {
        Swal.fire({
          title: "Minimum Quantity",
          text: "Quantity cannot be less than 1.",
          icon: "warning",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed!",
        text: "Something went wrong while updating quantity.",
        icon: "error",
      });
    }
  };

  // Handle clear cart
  const clearCart = () => {
    Swal.fire({
      title: "Clear Cart?",
      text: "Are you sure you want to remove all items from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, clear it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          localStorage.removeItem(import.meta.env.VITE_CART_NAME || "CART");

          // Update React Query cache immediately
          queryClient.setQueryData(["cartProducts"], []);

          Swal.fire({
            title: "Cleared!",
            text: "Your cart has been cleared.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: "Failed!",
            text: "Something went wrong while clearing your cart.",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <CartContext.Provider
      value={{
        handleAddToCart,
        removeProduct,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartData,
        refetch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

