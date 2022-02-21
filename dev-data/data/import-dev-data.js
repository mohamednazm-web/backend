const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config({
    path: './config.env'
});

// const DB = process.env.DATABASE.replace(
//     '<PASSWORD>',
//     process.env.DATABASE_PASSWORD
// );

mongoose
    .connect(process.env.DATABASE_LOCAL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connection successful!'));

// READ JSON FILE

const products = JSON.parse(
    fs.readFileSync(`${__dirname}/products.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
    try {

        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        //await Product.deleteMany();
        //await BannerBottom.deleteMany();

        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}