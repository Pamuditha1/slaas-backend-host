var express = require('express');
var app = express();
const router = express.Router();
var multer = require('multer')
var cors = require('cors');

app.use(cors());

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, `csvFiles`)
},
filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname )
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
    return res.status(200).send("File Successfully Uploaded.")

    })

});



module.exports = router;