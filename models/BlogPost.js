const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
    title: {
        type: String,
        unique: true
    },
    message: String,
    email: String,
    datePosted:{
        type: Date,
        default: new Date()
    },
    image: String
})

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
module.exports = BlogPost