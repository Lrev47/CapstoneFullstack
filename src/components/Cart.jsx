import React, { useState, useEffect } from "react";
import {
  useUpdateOrderItemQuantityMutation,
  useGetPendingOrderByUserIdQuery,
  useDeleteOrderItemMutation,
} from "../StoreApi";
import PurchaseandTotalSection from "./PurchaseOrderandTotal";

export const CartPage = ({ token, userId }) => {
  const {
    data: CartData,
    error: CartError,
    isLoading: CartLoading,
  } = useGetPendingOrderByUserIdQuery({ userId });

  const [updateOrderItemQuantity] = useUpdateOrderItemQuantityMutation();
  const [deleteOrderItem] = useDeleteOrderItemMutation();

  const deleteItem = async (orderItemId) => {
    try {
      await deleteOrderItem({ orderItemId });
    } catch (error) {
      console.error(error);
    }
  };

  const updateQuantity = (orderItemId, NewQuantity) => {
    if (NewQuantity < 1) {
      console.log("To remove item click delte");
      return;
    }

    updateOrderItemQuantity({
      orderItemId: orderItemId,
      quantity: NewQuantity,
      token: token,
    }).catch((error) => {
      console.error(error);
    });
  };

  if (CartLoading) {
    return <div>Loading ..</div>;
  }

  if (CartError) {
    return <div>Error: {CartError.message}</div>;
  }

  return (
    <>
      <div className="CartContainer">
        {/* <PurchaseandTotalSection orders={[CartData]} userId={userId} /> */}
        {CartData?.orderItems?.map((item) => (
          <div key={item.product.id} className="CartItemContainer">
            <div className="CartItemInfoDiv">
              <p>{item.product.name}</p>
              <p>Product Id: {item.product.id}</p>
              <p>Category: {item.product.category}</p>
              <p>Price: ${item.product.price.toFixed(2)}</p>
              <p>Rating: {item.product.rating}</p>
              <p>{item.product.inStock ? "In Stock" : "Out of Stock"}</p>
              <p>Description: {item.product.description}</p>
            </div>

            <div className="CartItemImageAndQuantDiv">
              <img className="CartItemImage" src={item.product.imageUrl} />
              <div className="CartQuantity">
                <button
                  className="CartQuantityButton"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>

                <p>Quantity: {item.quantity}</p>
                <button
                  className="CartQuantityButton"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="DeleteItemFromCartButton"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {/* <PurchaseandTotalSection orders={orders} userId={userId} /> */}
      </div>
    </>
  );
};

export default CartPage;
