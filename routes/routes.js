const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const users = require('../models/users');

// image upload configuration
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});

var upload = multer({ 
    storage: storage,
}).single('image');

// insert user to database
router.post('/add', upload, (req, res) =>{
    const user = new User ({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename
    });
    user.save().then(()=>{
        req.session.message ={
            type: 'success',
            message: 'user added succesfully!'
        };
        res.redirect('/');
    }).catch((err)=>{
        res.json({message: err.message, type:'danger'});
    });
})

// get all users
router.get("/", async (req, res) => {
  try {
    const usersList = await User.find().exec();

    res.render('index', {
      title: 'Home Page',
      users: usersList
    });
  } catch (err) {
    res.json({
      message: err.message
    });
  }
});

router.get('/add', (req, res) => {
    res.render('add_users.ejs', { title: 'Add Users' });
});

// edit user
router.get('/edit/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.findById(id).exec();
    if (!user) {
      return res.redirect('/');
    }
    res.render('edit_users.ejs', {
      title: 'Edit User',
      user: user
    });
  } catch (err) {
    res.redirect('/');
  }
})

module.exports = router;