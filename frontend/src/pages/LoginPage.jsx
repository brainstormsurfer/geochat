// import "./LoginPage.css";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setMyLocation } from "../MapPage/mapSlice";
// import { getFakeLocation } from "./FAKE_LOCATIONS";
// import { connectWithSocketIOServer } from "../socketConn/socketConn";
// import { proceedWithLogin } from "../store/actions/loginPageActions";

// import Logo from "../components/Logo";
// import LoginInput from "./components/LoginInput";
// import LoginButton from "./components/LoginButton";

// const isUsernameValid = (username) => {
//   return username.length > 0 && username.length < 10 && !username.includes(" ");
// };

// const locationOptions = {
//   enableHighAccuracy: true,
//   timeout: 5000,
//   maximumAge: 0,
// };

// const LoginPage = () => {
//   const [username, setUsername] = useState("");
//   const [locationErrorOccures, setLocationErrorOccures] = useState(false);

//   const myLocation = useSelector((state) => state.map.myLocation);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleLogin = () => {
//     console.log("handleLogin myLocation", myLocation);
//     if (myLocation) {
//       proceedWithLogin({
//         username,
//         coords: {
//           lat: myLocation.lat,
//           lng: myLocation.lng,
//         },
//       });
//       navigate("/map");
//     } else {
//       console.log("handleLogin - NO myLocation", myLocation);
//       console.log("handleLogin > locationErrorOccures", locationErrorOccures);
//     }
//   };

//   const onSuccess = (position) => {
//     console.log("onSuccess position", position);
//     dispatch(
//       setMyLocation({
//         lat: position.coords.latitude,
//         lng: position.coords.longitude,
//       })
//     );
//   };
//   const onError = (error) => {
//     console.log("Error occured when trying to get location");
//     console.log(error);
//     setLocationErrorOccures(true);
//   };

//   useEffect(() => {
//     // try {
//     //   if (navigator.geolocation) {
//     //     navigator.geolocation.getCurrentPosition((position) => {
//     //       onSuccess(position), onError, locationOptions;
//     //     });
//     //   }
//     // } catch (err) {
//     //   console.log("Error occured when trying to get location", err);
//     // }

//     onSuccess(getFakeLocation());
//   }, []);

//   useEffect(() => {
//     console.log("inside useEffect", myLocation);

//     if (myLocation) {
//       console.log("useEffect > if > myLocation", myLocation);
//       connectWithSocketIOServer();
//     }
//   }, [myLocation]);

//   return (
//     <div className="l_page_main_container">
//       <div className="l_page_box">
//         <Logo />
//         <LoginInput username={username} setUsername={setUsername} />
//         <LoginButton
//           disabled={locationErrorOccures || !isUsernameValid(username)}
//           onClickHandelr={handleLogin}
//         />
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
