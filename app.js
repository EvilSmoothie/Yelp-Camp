const express = require('express');
const app = express();
const path = require('path');
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate'); 
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground');
const methodOverrride = require('method-override');
const Review  = require('./models/review');
const campground = require('./models/campground');

const campgrounds = require("./routes/campgrounds")
const reviews = require('./routes/reviews');



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

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews)


app.get('/', (req, res) => {
    res.render('home')
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