const express = require('express');
const router = express.Router();
const service = require('../services/articleService');


/**
 * @ResponseBody
 * {
 * "articleID": 1,
 * "title": "Article Title",
 * "content": "Article Content",
 * "sourceLink": "Source Link",
 * "concepts": [{
    * "conceptID": 1,
    * "conceptName": "Concept Name"}],
 * "fieldsOfStudy": ["Field1", "Field2"]
 * }
 */
router.get('/article/:articleID', async (req, res) => {
    try{
        const articleID = req.params.articleID;

        const articleService = new service.ArticleService();
        const article = await articleService.getArticle(articleID);

        return res.status(200).json(article);

    } catch (error) {
        console.error(error);

        res.status(404).json({
            message: "Article not found"
        });
    }
});
/**
 * @ResponseBody
    {
        "mermaid_flowchart" : ""
    }
```
 */
router.get('/article/:articleID/conceptMap', async (req, res) => {
    try {
        const articleID = req.params.articleID;

        const articleService = new service.ArticleService();
        const conceptMap = await articleService.getConceptMap(articleID);

        return res.status(200).json(conceptMap);


    } catch (error) {
        console.error(error);
        res.status(404).json({
            message: "Article not found"
        });
    }
});

module.exports = router;
