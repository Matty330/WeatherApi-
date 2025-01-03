import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import cors from 'cors'; // Add this line

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Serve static files from the client/dist folder
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the routes
app.use(routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});