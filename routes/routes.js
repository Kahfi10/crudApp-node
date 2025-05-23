const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');

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



router.get('/', (req, res) =>{
    res.render('index.ejs', { title: 'Home page' });
});

router.get('/add', (req, res) => {
    res.render('add_users.ejs', { title: 'Add Users' });
});

module.exports = router;