// import express from "express";
// const router = express.Router();
// import { fileURLToPath } from "url";
// import path from "path";


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // router.get("^/$|/index(.html)?", (req, res) => {
// //   res.sendFile(path.join(__dirname, "..", "views", "index.html"));
// // });


// router.get("/api/v1", (req, res) => {
//     res.sendFile(path.join(__dirname, "..", "views", "index.html"));
//   });
// console.log("Root", router);
// export default router;
// root.js
import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("^/$|/index(.html)?", (req, res) => {

    console.log("ROOOOOOOOOOOOOOT")
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

export default router;
