import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

// route component
import postRoutes from './routes/Posts.js';
import userRoutes from './routes/Users.js';

const app = express();

// Node.js body parsing middleware.
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

// route 
app.use('/posts', postRoutes);
app.use('/user', userRoutes);

// mongodb database link
const CONNECTION_URL = 'mongodb://localhost:27017/posts';

// start server(port)
const PORT = process.env.PORT || 5000;

// create connection (mongodb database)
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));
