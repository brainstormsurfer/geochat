import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const links = [
  { id: 1, url: '/', text: 'home' },
  { id: 2, url: 'about', text: 'about' },
  { id: 3, url: 'events', text: 'events' },
  { id: 4, url: 'cart', text: 'cart' },
  { id: 5, url: 'checkout', text: 'checkout' },
  { id: 6, url: 'orders', text: 'orders' },
];

const NavLinks = () => {
  const user = useSelector((state) => state.userState.user);
  return (
    <>
      {links.map((link) => {
        const { id, url, text } = link;
        if ((url === 'checkout' || url === 'orders') // protected routes visible after login (yet approachable manually)
         && !user
        ) return null;
        return (
          <li key={id}>
            <NavLink className='capitalize  ml-2' to={url}>
            {/* <NavLink className='capitalize ml-2 sm:m-1 sm:h-10 sm:p-2 hover' to={url}> */}
              {text}
            </NavLink>
          </li>
        );
      })}
    </>
  );
};
export default NavLinks;
