const express = require('express');
const app = express();
const path = require('path');
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate'); 
const flash = require('express-flash')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground');
const methodOverrride = require('method-override');
const Review  = require('./models/review');
const campground = require('./models/campground');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');  
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');
const campgroundRoutes = require("./routes/campgrounds")
const session = require('express-session');



mongoose.set('strictQuery', false)

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log("Database Connected.")
}

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true}))
app.use(methodOverrride('_method'))
app.use(express.static(path.join(__dirname, 'public')));




const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);



app.get('/', (req, res) => {
    res.render('home')
})

app.get('/fakeuser', async (req, res) => {
 const user = new User({ email: 'traff@gmail.com', username: 'Aaron'})
 const newUser = await User.register(user, 'chicken');
 res.send(newUser)
})

app.all('*', (req, res, next) => {
next(new ExpressError('Page Not Found', 404))
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message =  'Oh No, SOmething went wrong.'
    res.status(statusCode).render('error', { err });
})



app.listen(3000, () => {
    console.log("Serving on port 3000.")
}) 