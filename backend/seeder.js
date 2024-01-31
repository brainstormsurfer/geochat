// import fs from "fs";
// import dotenv from "dotenv";
// import colors from "colors";
// import Helper from "./src/models/Helper.js";
// // import Event from "./src/models/Event.js";
// // import User from "./src/models/User.js";
// // import Feedback from "./src/models/Feedback.js";
// import connectDB from "./config/dbConn.js";
// dotenv.config(); 

//   // const usersJsonPath = new URL("./_data/users.json", import.meta.url);
//   const helpersJsonPath = new URL("./_data/helpers.json", import.meta.url);
//   // const eventsJsonPath = new URL("./_data/events.json", import.meta.url);
//   // const feedbacksJsonPath = new URL("./_data/feedbacks.json", import.meta.url);

//   // const users = JSON.parse(fs.readFileSync(usersJsonPath, "utf-8"));
//   const helpers = JSON.parse(fs.readFileSync(helpersJsonPath, "utf-8"));
//   // const events = JSON.parse(fs.readFileSync(eventsJsonPath, "utf-8"));
//   // const feedbacks = JSON.parse(fs.readFileSync(feedbacksJsonPath, "utf-8"));

// // Import into DB
// const importData = async () => {
//   try {    
//     await connectDB();

//     await Helper.create(helpers);
//     // await Event.create(events);
//     // await User.create(users);
//     // await Feedback.create(feedbacks);
// // 
//     console.log("Data Imported...".green.inverse);
//     process.exit();
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// };

// // Delete data
// const deleteData = async () => {
//   try {
//     await connectDB();     

//     await Helper.deleteMany();
//     // await Event.deleteMany();
//     // await User.deleteMany();
//     // await Feedback.deleteMany();

//     console.log("Data Destroyed...".red.inverse);
//     process.exit();
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// };

// if (process.argv[2] === "-i") {
//   importData();
// } else if (process.argv[2] === "-d") {
//   deleteData();
// }

// // Run in the terminal `node seeder.js -i` for importing data into DB
// // Run in the terminal `node seeder.js -d` for destrying data in DB


//  // ASYNC SEEDER - WORKS WITH MONGODB
// // import fs from "fs";
// // import mongoose from "mongoose";
// // import colors from "colors";
// // import dotenv from "dotenv";
// // import User from "./src/models/User.js";
// // import connectDB from "./config/dbConn.js";

// // // Load environment variables
// // dotenv.config();

// // // Define the JSON file path
// // const usersJsonPath = new URL("./_data/users.json", import.meta.url);

// // // Import data into DB
// // const importData = async () => {
// //   try {
// //     // Connect to MongoDB
// //     await connectDB();

// //     // Read users from JSON file
// //     const users = JSON.parse(fs.readFileSync(usersJsonPath, "utf-8"));

// //     // Import users into the database
// //     await User.create(users);

// //     console.log("Data Imported...".green.inverse);
// //     process.exit();
// //   } catch (err) {
// //     console.error(err);
// //     process.exit(1);
// //   }
// // };

// // // Delete data from DB
// // const deleteData = async () => {
// //   try {
// //     // Connect to MongoDB
// //     await connectDB();

// //     // Delete all users
// //     await User.deleteMany();

// //     console.log("Data Destroyed...".red.inverse);
// //     process.exit();
// //   } catch (err) {
// //     console.error(err);
// //     process.exit(1);
// //   }
// // };

// // // Check the command line argument to decide whether to import or delete data
// // if (process.argv[2] === "-i") {
// //   importData();
// // } else if (process.argv[2] === "-d") {
// //   deleteData();
// // }

import fs from 'fs';
import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';
import connectDB from "./config/dbConn.js";

import Helper from './src/models/Helper.js';
// import Course from './models/Course.js';
// import User from './models/User.js';
// import Review from './models/Review.js';

dotenv.config({ path: './config/config.env' });

// mongoose.connect(process.env.MONGO_URI, {
// });


// const courses = JSON.parse(
  //   fs.readFileSync(new URL('./_data/courses.json', import.meta.url), 'utf-8')
  // );
  
  // const users = JSON.parse(
    //   fs.readFileSync(new URL('./_data/users.json', import.meta.url), 'utf-8')
// );

// const reviews = JSON.parse(
//   fs.readFileSync(new URL('./_data/reviews.json', import.meta.url), 'utf-8')
// );
const helpersJsonPath = (new URL('./_data/helpers.json', import.meta.url))
  const helpers = JSON.parse(fs.readFileSync(helpersJsonPath, "utf-8"));


// Import into DB
const importData = async () => {
  try {
    await connectDB();
    
    //     await Helper.create(helpers);
    await Helper.create(helpers);
    // await Course.create(courses);
    // await User.create(users);
    // await Review.create(reviews);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Helper.deleteMany();
    // await Course.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}

// Run in the terminal `node seeder.js -i` for importing data into DB
// Run in the terminal `node seeder.js -d` for destrying data in DB