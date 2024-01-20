import fs from "fs";
import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";

import Helper from "./src/models/Helper.js";
import Event from "./src/models/Event.js";
import User from "./src/models/User.js";
import Feedback from "./src/models/Feedback.js";

dotenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGO_URI, {});

const helpers = JSON.parse(
  fs.readFileSync(new URL("./_data/helpers.json", import.meta.url), "utf-8")
);

const events = JSON.parse(
  fs.readFileSync(new URL("./_data/events.json", import.meta.url), "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(new URL("./_data/users.json", import.meta.url), "utf-8")
);

const feedbacks = JSON.parse(
  fs.readFileSync(new URL("./_data/feedbacks.json", import.meta.url), "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await Helper.create(helpers);
    await Event.create(events);
    await User.create(users);
    await Feedback.create(feedbacks);

    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Helper.deleteMany();
    await Event.deleteMany();
    await User.deleteMany();
    await Feedback.deleteMany();

    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}

// Run in the terminal `node seeder.js -i` for importing data into DB
// Run in the terminal `node seeder.js -d` for destrying data in DB
