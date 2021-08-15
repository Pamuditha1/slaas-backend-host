var express = require('express');
var app = express();
const router = express.Router();
var multer = require('multer')
var cors = require('cors');

const connection = require('../database')

app.use(cors());

var fileToDB = ''

//configure place to store image

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `profilePics`)
    },

    filename: function (req, file, cb) {
        const fileType = file.originalname.split('.')[1] 
        fileToDB = req.headers.nameofimage + '.' + fileType

        cb(null, req.headers.nameofimage + '.' + fileType )
    }
    
})

var upload = multer({ storage: storage }).single('file')

router.post('/',function(req, res) {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err)
            return res.status(500).json(err)
        } else if (err) {
            console.log(err)
            return res.status(500).json(err)
        }
        addImage(req,res)

    })

});

function addImage(req, res) {

    //update image string

    connection.query(`UPDATE members
    SET image='${fileToDB}' WHERE nic='${req.headers.nameofimage}';`, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }
        if(!fileToDB) return res.status(400).send("No Image Uploaded")

        return res.status(200).send("Image Successfully Uploaded.")      

    });
}



module.exports = router;















// var express = require('express');
// var app = express();
// const router = express.Router();
// var multer = require('multer')
// var cors = require('cors');

// const connection = require('../database')

// app.use(cors());

// router.post('/',function(req, res) {

//     //update image url in database
    
//     connection.query(`UPDATE members
//     SET image='${req.body.url}' WHERE nic='${req.body.nic}';`, (error, results, fields) => {

//         if(error) {
//             res.status(404).send(error);
//             console.log("Save profile pic uploading error : ",error)
//             return 
//         }
//         return res.status(200).send("Image Successfully Uploaded.")      

//     });

// });

// router.get('/view',function(req, res) {

//     //update image url in database
    
//     connection.query(`UPDATE members
//     SET image='${req.body.url}' WHERE nic='${req.body.nic}';`, (error, results, fields) => {

//         if(error) {
//             res.status(404).send(error);
//             console.log("Save profile pic uploading error : ",error)
//             return 
//         }
//         return res.status(200).send("Image Successfully Uploaded.")      

//     });

// });

// var fileToDB = ''

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, `profilePics`)
//     },

//     filename: function (req, file, cb) {
//         const fileType = file.originalname.split('.')[1] 
//         fileToDB = req.headers.nameofimage + '.' + fileType

//         cb(null, req.headers.nameofimage + '.' + fileType )
//     }
    
// })

// var upload = multer({ storage: storage }).single('file')



// router.post('/',function(req, res) {

//     //upload image 

//     upload(req, res, function (err) {
//         if (err instanceof multer.MulterError) {
//             console.log("Profile pic uploading error : ", err)
//             return res.status(500).json(err)
//         } else if (err) {
//             console.log("Profile pic uploading error : ",err)
//             return res.status(500).json(err)
//         }
//         addImage(req,res)

//     })

// });

// function addImage(req, res) {

//     //update image string in database
    
//     connection.query(`UPDATE members
//     SET image='${fileToDB}' WHERE nic='${req.headers.nameofimage}';`, (error, results, fields) => {

//         if(error) {
//             res.status(404).send(error);
//             console.log("Save profile pic uploading error : ",error)
//             return 
//         }
//         return res.status(200).send("Image Successfully Uploaded.")      

//     });
// }



// module.exports = router;