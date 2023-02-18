const express = require('express');
const tagsRouter = express.Router();

const { getAllTags } = require('../db');

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

    res.send({
        tags
    });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    try {
        // use our method to get posts by tag name from the db
        // send out an object to the client { posts: // the posts }
        const tagData = await getAllTags({
            postId,
            tagId
        });
        const tags = await getAllTags (tagData);
        res.send({
            tags
        });
    } catch ({ name, message }) {
        next({ name, message }); // forward the name and message to the error handler
    }
});
module.exports = tagsRouter;