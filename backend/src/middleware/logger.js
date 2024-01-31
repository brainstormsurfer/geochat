import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Set static folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const maxLogSize = process.env.MAX_LOG_FILE_SIZE || 1024 * 1024;  // Default to 1 MB
const maxLogFiles = process.env.MAX_LOG_FILES || 10;  // Default to 10 files


// const logEvents = async (message, logName) => {
//     const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
//     const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;
  
//     try {
//       const logsDir = path.join(__dirname, '..', 'logs');
//       if (!fs.existsSync(logsDir)) {
//         await fsPromises.mkdir(logsDir);
//       }
  
//       // Check the size of the log file
//       const logPath = path.join(logsDir, logName);
//       const stats = await fsPromises.stat(logPath);
  
//       // Rotate logs if size exceeds a certain threshold (e.g., 1 MB)
//       if (stats.size > maxLogSize) {
//         const rotatedLogName = `${logName.replace('.txt', '')}_${dateTime}.txt`;
//         await fsPromises.rename(logPath, path.join(logsDir, rotatedLogName));
//       }
  
//       // Get the list of existing log files
//       const existingLogs = await fsPromises.readdir(logsDir);
  
//       // Keep the latest 'maxLogFiles' logs and delete the older ones
//       const logsToDelete = existingLogs
//         .filter((file) => file.startsWith(logName.replace('.txt', '')))
//         .slice(0, -maxLogFiles);
  
//       await Promise.all(
//         logsToDelete.map((logToDelete) =>
//           fsPromises.unlink(path.join(logsDir, logToDelete))
//         )
//       );
  
//       // Append the new log entry
//       await fsPromises.appendFile(logPath, logItem);
//     } catch (err) {
//       console.error(err);
//     }
//   };
  
const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
  const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`

  try {
      if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
          await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
      }
      await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
  } catch (err) {
      console.log(err)
  }
}

  const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
  };
  
  export { logger, logEvents };
  