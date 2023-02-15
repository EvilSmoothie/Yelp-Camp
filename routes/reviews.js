const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review  = require('../models/review');
const Campground = require('../models/campground')
const { reviewSchema } = require('../schemas.js')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    const {rating} = req.body.review;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    
    req.flash(`success`, `Posted your ${rating}* Review!`);
    res.redirect(`/campgrounds/${campground._id}`)
 }))

 router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
     await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId}})
     await Review.findByIdAndDelete(reviewId);
     req.flash('success', 'Successfully deleted your review');
     res.redirect(`/campgrounds/${id}`)

 }))
 
module.exports = router;