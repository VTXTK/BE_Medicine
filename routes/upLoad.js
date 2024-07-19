const router = require('express').Router()
//const upLoadController = require('../controller/upLoadController')
const multer = require('multer');
const path = require('path');


const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            let url = './public/images';

            if (req.headers['upload-type'] === 'avatar') {
                url += '/avatar';
            }

            if (req.headers['upload-type'] === 'product') {
                url += '/product';
            }

            cb(null, url);
        },
        filename: (req, file, cb) => {
            // Tạo tên file ngẫu nhiên
            const randomName = Math.random().toString(36).substring(2, 12);

            cb(null, `${file.originalname.split('.')[0]}-${randomName}${path.extname(file.originalname)}`);
        }
    }),

    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

        if (!req.headers['upload-type']) {
            return cb(new Error('Cần thiết lập upload-type'), false);
        }

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('File extension không được phép'));
        }

        cb(null, true);
    }

});
router.post('/upload', upload.single('fileImg'), async (req, res) => {

    if (req.headers['upload-type'] === 'avatar') {
        // Xử lý upload avatar
        res.json({ data: { fileUploaded: req.file.filename } });

    } else if (req.headers['upload-type'] === 'product') {
        // Lưu product vào DB

        res.json({ data: { fileUploaded: req.file.filename } });
        //  res.json({ data: { fileUploaded: req.file.filename } });

    } else {
        throw new Error('Cần set upload-type header');
    }

})
module.exports = router