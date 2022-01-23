var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');
const Course = require('../models/Course');
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const path = require('path')

require('dotenv').config()

///////////////////////////////////////////////////////////////////////////
//DB connection
mongoose.connect(process.env.DB_URL,{
  useNewUrlParser: true
})
if(mongoose){
  console.log('DB connected!!!')
} else {
  console.log('No DB connected.')
}
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended:true}))
router.use(fileUpload())
//////////////////////////////////////////////////////////////////////////

router.get('/', async (req, res)=>{
  const blogpost = await BlogPost.find({}).limit(1).sort({_id: -1});
  const course = await Course.find({}).limit(1).sort({_id: -1});
  res.render('index', {
    title: 'Freelance Web Developer',
    isAuthenticated: req.oidc.isAuthenticated(),
    blogpost, course
  })
})

router.get('/about', (req, res, next)=>{
  res.render('about')
})

router.get('/new/posts', (req, res )=>{
  res.render('create')
})

router.get('/new/course', (req, res) => {
  res.render('newCourse')
})

router.get('/catalog', (req, res)=>{
  res.render('catalog')
})

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});

// Post Handling
router.post('/posts/store', async (req, res)=>{
  let image = req.files.image;
    await image.mv(path.resolve(__dirname, '../', 'public/img', image.name), async (error) => {
    await BlogPost.create({
      ...req.body,
      image: '/img/' + image.name
    })
    res.redirect('/')
  })
});

router.get('/blogs', async (req, res)=>{
  const blogposts = await BlogPost.find({}).limit(20).sort({_id: -1});
  res.render('blogs', {
    blogposts
  })
})

router.get('/post/:id', async (req, res)=>{
  const blogpost = await BlogPost.findById(req.params.id)
  res.render('post', {
    blogpost
  })
})

/////////////////////////////////////////////////////////////////////
// Course Handling
router.post('/courses/store', async (req, res)=>{
  let image = req.files.image;
  await image.mv(path.resolve(__dirname, '../', 'public/img', image.name), async (error) => {
    await Course.create({
      ...req.body,
      image: '/img/' + image.name
    })
    res.redirect('/')
  })
});

router.get('/courses', async (req, res)=>{
  const courses = await Course.find({}).limit(20).sort({_id: -1});
  res.render('courses', {
    courses
  })
})

router.get('/course/:id', async (req, res)=>{
  const course = await Course.findById(req.params.id)
  res.render('course', {
    course
  })
})

module.exports = router;
