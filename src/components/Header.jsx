import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../features/users/userSlice';
// import { clearCart } from '../features/cart/cartSlice';
// import { useQueryClient } from '@tanstack/react-query';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const queryClient = useQueryClient();
  const user = useSelector((state) => state.userState.token);
// console.log("user in header:", user.user)
// console.log("user?.user?.username:", user?.user?.username)
// console.log("user?.user header:", user?.user)
console.log("user?.user header:", user)


  const handleLogout = () => {
    navigate('/');
    // dispatch(clearCart());
    // console.log("user in handleLogout:", user?.user)

    // dispatch(logoutUser(user?.user));
    // queryClient.removeQueries();
  };

  return (
    <header className='bg-neutral py-2 text-neutral-content'>
      <div className='align-element flex justify-center sm:justify-end'>
  
         {user && user.username ? (
          <div className='flex flex-grow lg:gap-x-100 sm:gap-x-8 items-center'>
            <p className='text-xs sm:text-sm'>Hello,
             {/* {user.user.username} */}
             </p>
            <button
              className='btn btn-xs btn-outline btn-primary'
              onClick={handleLogout}
            >
              logout
            </button>
          </div>
        ) : (
          <div className='flex gap-x-6 justify-center items-center'>
            <Link to='/login' className='link link-hover text-xs sm:text-sm'>
              Sign in / Guest
            </Link>
            <Link to='/register' className='link link-hover text-xs sm:text-sm'>
              Create Account
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
