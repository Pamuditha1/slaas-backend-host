var express = require('express');
var app = express();
const router = express.Router();
var multer = require('multer')
var cors = require('cors');

const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '0112704105',
    database : 'slaasproject'
});

app.use(cors());

var fileToDB = ''

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `profilePics`)
    },

    filename: function (req, file, cb) {
        // cb(null, Date.now() + '-' + file.originalname )
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

    connection.query(`UPDATE members
    SET image='${fileToDB}' WHERE nic='${req.headers.nameofimage}';`, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }
        return res.status(200).send("Image Successfully Uploaded.")      

    });
}



module.exports = router;