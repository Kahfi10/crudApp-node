const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const users = require('../models/users');
const fs = require('fs');

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
});

// update user
  router.post('/update/:id', upload, async (req, res) => {
    let id = req.params.id;
    let new_image = '';
  
    if (req.file) {
      new_image = req.file.filename;
      try {
        fs.unlinkSync('./uploads/' + req.body.old_image);
      } catch (err) {
        console.log(err);
      }
    } else {
      new_image = req.body.old_image;
    }
  
    User.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: new_image  
    }).then(() => {
      req.session.message = {
        type: 'success',
        message: 'User updated successfully!'
      };
      res.redirect('/');
    }).catch((err) => {
      res.json({ message: err.message, type: 'danger' });
    });
  });

  // Delete user route
  router.get('/delete/:id', async (req, res) => {
    let id = req.params.id;
    try {
      const result = await User.findByIdAndDelete(id).exec();
      if (result && result.image) {
        try {
          fs.unlinkSync('./uploads/' + result.image);
        } catch (err) {
          console.log(err);
        }
      }
      req.session.message = {
        type: 'info',
        message: 'User deleted successfully!'
      };
      res.redirect('/');
    } catch (err) {
      res.json({ message: err.message });
    }
  });

module.exports = router;