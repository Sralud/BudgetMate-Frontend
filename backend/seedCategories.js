const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const connectDB = require('./config/db');

dotenv.config({ path: __dirname + '/.env' });
console.log('Env keys:', Object.keys(process.env).filter(k => !k.startsWith('npm_') && !k.startsWith('Program')));

const categories = [
    'Housing',
    'Food',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Subscription',
    'Savings',
    'Other',
];

const seedCategories = async () => {
    try {
        await connectDB();

        // Check if categories already exist
        const count = await Category.countDocuments();
        if (count > 0) {
            console.log('Categories already seeded!');
            process.exit();
        }

        const categoryDocs = categories.map(name => ({ name }));
        await Category.insertMany(categoryDocs);

        console.log('Categories seeded successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedCategories();
