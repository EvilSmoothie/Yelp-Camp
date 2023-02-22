const mongoose = require('mongoose');
const cities = require('./cities')
const Campground = require('../models/campground');
const {places, descriptors} = require('./seedHelpers');



mongoose.set('strictQuery', false)

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log("Database Connected.")
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
            geometry: { 
              type: 'Point', 
              coordinates: [ -1.240239, 51.401925 ] 
            },
            author: '63dedf3ca2c550f30e500c17',
            description: 'lorem',
            images: [
                {
                    url: 'https://res.cloudinary.com/dmvogvw8l/image/upload/v1676594195/YelpCamp/dmysea0oxtuayfa99doj.jpg',
                    filename: 'YelpCamp/dmysea0oxtuayfa99doj'
                  },
                  {
                    url: 'https://res.cloudinary.com/dmvogvw8l/image/upload/v1676594196/YelpCamp/ax0wxfcyrlaar4e5vskq.jpg',
                    filename: 'YelpCamp/ax0wxfcyrlaar4e5vskq'
                  }
              
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});