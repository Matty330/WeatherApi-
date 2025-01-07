import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js'; // Ensure this path is correct
import cors from 'cors';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// Enable CORS
app.use(cors());
// Serve static files from the client/dist folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../../client/dist')));
// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Use the routes
app.use(routes);
// Catch-all route for undefined routes
app.use((req, res) => {
    res.status(404).send('Route not found');
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
