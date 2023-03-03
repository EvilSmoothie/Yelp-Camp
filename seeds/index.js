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
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
            geometry: { 
              type: 'Point', 
              coordinates: [cities[random1000].longitude, 
            cities[random1000].latitude],
            },
            author: '63dedf3ca2c550f30e500c17',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius voluptatibus obcaecati voluptate rem beatae quo ipsa accusamus possimus expedita sit, similique ullam, tempora soluta quibusdam natus maiores. Quibusdam, tempore! Quaerat?. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius voluptatibus obcaecati voluptate rem beatae quo ipsa accusamus possimus expedita sit, similique ullam, tempora soluta quibusdam natus maiores. Quibusdam, tempore! Quaerat?. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius voluptatibus obcaecati voluptate rem beatae quo ipsa accusamus possimus expedita sit, similique ullam, tempora soluta quibusdam natus maiores. Quibusdam, tempore! Quaerat?. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius voluptatibus obcaecati voluptate rem beatae quo ipsa accusamus possimus expedita sit, similique ullam, tempora soluta quibusdam natus maiores. Quibusdam, tempore! Quaerat?',
            images: [
                {
                    url: 'https://res.cloudinary.com/dmvogvw8l/image/upload/v1676597263/YelpCamp/ieykyrazjdl2qgbrdynh.jpg',
                    filename: 'YelpCamp/ieykyrazjdl2qgbrdynh'
                  },
                  {
                    url: 'https://res.cloudinary.com/dmvogvw8l/image/upload/v1676597264/YelpCamp/kairxdbh8tplafhn54aw.jpg',
                    filename: 'YelpCamp/kairxdbh8tplafhn54aw'
                  }
              
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});