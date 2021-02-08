const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');
const { auth } = require('./middlewares/auth');
const { getHomeBlogs } = require('./controllers/blog');
const cors = require('cors');

const app = express();

app.use(cors());

const { MONGODB_URI } = process.env;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// mongoose.connect('mongodb://localhost:27017/blog-post', { useNewUrlParser: true });

app.use(express.json());
app.use('/images/', express.static('images'));
app.use('/users', userRoutes);
app.use('/blogs', auth, blogRoutes);
app.get('/', async (req, res, next) => {
    try {
        const blogs = await getHomeBlogs();
        res.json(blogs);
    } catch(e){
        next(e);
    }
});


const { PORT = 3000 } = process.env;

app.use((err, req, res, next) => {
    console.error(err.message);
    if (err.message == 'user not found') {
        res.status(422).json({ Error: "User not found!" });
    }
    if (err.message == 'No match') {
        res.status(422).json({ Error: "No matched blogs for your search" });
    }
    if (err.message == "Id invalid") {
        res.status(422).json({ Error: "Id is not accessible" });
    }
    if (err.message == 'invalid login') {
        res.status(401).json({ Error: "Invalid username or password" });
    }
    if (err.code === 11000) {
        res.status(422).json({ Error: "username already exists", property: err.keyValue });
    }
    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(422).json({ Error: err.message });
    }
})

app.listen(PORT, () => {
    console.log("App is ready on ", PORT);
});