const express = require('express');
const multer = require('multer');
const Photo = require('../model/Photo');
const Router = express.Router();
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const crypto = require("crypto");

const upload = multer({
    storage:
        multerS3({
            s3: new aws.S3(),
            bucket: process.env.BUCKET_NAME,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            acl: "public-read",
            key: (req, file, cb) => {
                crypto.randomBytes(16, (err, hash) => {
                    if (err) cb(err);

                    const fileName = `${hash.toString("hex")}-${file.originalname}`;

                    cb(null, fileName);
                });
            },
        }),
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg)$/)) {
            cb(new Error('only upload files with jpg or jpeg format.'));
        }
        cb(undefined, true);
    },
});

Router.post(
    '/photos',
    upload.single('photo'),
    async (req, res) => {
        try {
            const { originalname: name, size, key, location: url = "" } = req.file;

            const photo = await Photo.create({
                name,
                size,
                key,
                url
            });

            res.status(201).send({ _id: photo._id });
        } catch (error) {
            res.status(500).send({
                upload_error: 'Error while uploading file...Try again later.'
            });
        }
    },
    (error, req, res, next) => {
        if (error) {
            res.status(500).send({
                upload_error: error.message
            });
        }
    }
);


Router.get('/photos', async (req, res) => {
    try {
        const photos = await Photo.find({});
        console.log(photos)
        res.send(photos);
    } catch (error) {
        res.status(500).send({ get_error: 'Error while getting list of photos.' });
    }
});

Router.get('/photos/:id', async (req, res) => {
    try {
        const result = await Photo.findById(req.params.id);
        res.set('Content-Type', 'image/jpeg');
        res.send(result.photo);
    } catch (error) {
        res.status(400).send({ get_error: 'Error while getting photo.' });
    }
});

Router.delete("/photos/:id", async (req, res) => {
    try {
        const post = await Photo.findById(req.params.id);

        await post.remove();

        return res.send();
    } catch (error) {
        res.status(400).send({ get_error: 'Error while deleting photo.' });
    }
});

module.exports = Router;