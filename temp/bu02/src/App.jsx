import { RouterProvider, createBrowserRouter } from 'react-router-dom';
// // import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// // import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  About,
  // Cart,
  // Checkout,
  Error,
  HomeLayout,
  Landing,
  Login,
  // Orders,
  // Events,
  Register,
  // SingleEvent,
} from './pages';

import { ErrorElement
  // , FormInput, Header, Navbar
 } from './components';

// loaders
// import { loader as landingLoader } from './pages/Landing';
// import { loader as singleEventLoader } from './pages/SingleEvent';
// import { loader as eventsLoader } from './pages/Events';
// import { loader as checkoutLoader } from './pages/Checkout';
// import { loader as ordersLoader } from './pages/Orders';

import { action as registerAction } from './pages/Register';
import { action as loginAction } from './pages/Login';
// import { action as checkoutAction } from './components/CheckoutForm';
import { store } from './store';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60 * 5,
//     },
//   },
// });

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
        errorElement: <ErrorElement />,
        // loader: landingLoader(queryClient),
      },
      // {
      //   path: '/events',
      //   element: <Events />,
      //   // errorElement: <ErrorElement />,
      //   // loader: eventsLoader(queryClient),
      // },
      // {
      //   path: '/events/:id',
      //   element: <SingleEvent />,
      //   // errorElement: <ErrorElement />,
      //   // loader: singleEventLoader(queryClient),
      // },
      // {
      //   path: '/cart',
      //   element: <Cart />,
      // },
      {
        path: '/about',
        element: <About />,
      },
      {
        // path: '/checkout',
        // element: <Checkout />,
        // loader: checkoutLoader(store),
        // action: checkoutAction(store, queryClient),
      },
      // {
      //   path: '/orders',
      //   element: <Orders />,
      //   // loader: ordersLoader(store, queryClient),
      // },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />,
    action: loginAction(store)
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <Error />,
    action: registerAction(store),
  },
]);
const App = () => {
  
  return (
     <RouterProvider router={router} /> 
  );
};
export default App;

// <QueryClientProvider client={queryClient}>
//   <ReactQueryDevtools initialIsOpen={false} />
// </QueryClientProvider>