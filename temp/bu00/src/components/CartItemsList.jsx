import { useSelector } from 'react-redux';
import CartHelper from './CartHelper';

const CartHelpersList = () => {
  const cartHelpers = useSelector((state) => state.cartState.cartHelpers);
  return (
    <>
      {cartHelpers.map((helper) => {
        return <CartHelper key={helper.cartID} cartHelper={helper} />;
      })}
    </>
  );
};
export default CartHelpersList;
