import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <>
      <nav>
        <span className="text-4xl text-primary">Geochat</span>
      </nav>
      <Outlet />
    </>
  );
};

export default HomeLayout;

// import { Outlet, useNavigation } from 'react-router-dom';
// import { Header, Navbar, Loading } from '../components';
// const HomeLayout = () => {
//   const navigation = useNavigation();
//   const isPageLoading = navigation.state === 'loading';
//   return (
//     <>
//       <Header />
//       <Navbar />
//       {isPageLoading ? (
//         <Loading />
//       ) : (
//         <section className='align-element py-20'>
//           <Outlet />
//         </section>
//       )}
//     </>
//   );
// };
// export default HomeLayout;
