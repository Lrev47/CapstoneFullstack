import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useUpdateMultipleProductQuantitiesMutation,
  useUpdateUserMoneyMutation,
  useCreateOrderMutation,
  useUpdateOrderTotalByIdMutation,
} from "../StoreApi";

export const PurchaseandTotalSection = ({ cartData, userId }) => {
  const navigate = useNavigate();
  const [totalBalance, setTotalBalance] = useState(0);

  const [updateQuantities] = useUpdateMultipleProductQuantitiesMutation();
  const [updateUserMoney] = useUpdateUserMoneyMutation();
  const [createOrder] = useCreateOrderMutation();

  const [updateTotal] = useUpdateOrderTotalByIdMutation();

  useEffect(() => {
    console.log(cartData);
    if (cartData) {
      const total = cartData.orderItems.reduce((runningTotal, currentItem) => {
        return runningTotal + currentItem.product.price * currentItem.quantity;
      }, 0);
      setTotalBalance(total);
      console.log("THE TOTAL IS SET:", total);
    }
  }, [cartData]);

  const handleClick = async () => {
    const productToUpdate = cartData.orderItems.map((item) => ({
      productId: item.product.id,
      quantityToSubtract: item.quantity,
    }));
    try {
      console.log("THIS IS THE TOTAL BALANCE:", totalBalance);
      console.log(productToUpdate);
      await updateQuantities(productToUpdate);
      await updateUserMoney({ userId, totalBalance });

      await updateTotal({
        ...cartData,
        orderId: cartData.id,
      });

      await createOrder({ userId });
      navigate(`/orderComplete`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
    }
  };
  console.log("CART DATA:", cartData);
  return (
    <div className="PurchaseOrderandTotalContainer">
      <h1>
        Total Balance: $
        {totalBalance.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </h1>
      <button className="PurchaseItemsButton" onClick={handleClick}>
        Purchase Items
      </button>
    </div>
  );
};

export default PurchaseandTotalSection;
