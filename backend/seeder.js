import fs from "fs";
import dotenv from "dotenv";
import colors from "colors";
import Helper from "./src/models/Helper.js";
import Event from "./src/models/Event.js";
import User from "./src/models/User.js";
import Feedback from "./src/models/Feedback.js";
import connectDB from "./config/dbConn.js";
dotenv.config(); 

const helpersJsonPath = new URL("./_data/helpers.json", import.meta.url);
  const usersJsonPath = new URL("./_data/users.json", import.meta.url);
  const eventsJsonPath = new URL("./_data/events.json", import.meta.url);
  const feedbacksJsonPath = new URL("./_data/feedbacks.json", import.meta.url);

  const helpers = JSON.parse(fs.readFileSync(helpersJsonPath, "utf-8"));
  const users = JSON.parse(fs.readFileSync(usersJsonPath, "utf-8"));
  const events = JSON.parse(fs.readFileSync(eventsJsonPath, "utf-8"));
  const feedbacks = JSON.parse(fs.readFileSync(feedbacksJsonPath, "utf-8"));

// Import into DB
const importData = async () => {
  try {    
    await connectDB();

    // await Helper.create(helpers);
    // await Event.create(events);
    // await User.create(users);
    await Feedback.create(feedbacks);
// 
    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();     

    await Helper.deleteMany();
    await Event.deleteMany();
    await User.deleteMany();
    await Feedback.deleteMany();

    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}