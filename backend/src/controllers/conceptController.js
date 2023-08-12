const express = require('express');
const router = express.Router();
const conceptService = require('../services/conceptService');

/**
 * @ResponseBody
 * {
 *  "conceptIds" : ["concept1Id", "concept2Id"]
 * }
 */
router.get('/concept/search/:conceptName', async (req, res) => {
    try{
        const searchConceptName = req.params.conceptName;
        /**
         * Two search modes:
         * 1. exactMatch - The concept name must be exactly the same as the concept name in the database.
         * 2. similarMatch - The concept name in the database must contain the concept name.
         */
        const searchMode = req.query.searchMode;

        const conceptSer = new conceptService();

        switch (searchMode) {
            case "similar":
                const similarConceptIds = await conceptSer.fetchConceptIdsAndNamesBySimilarConceptName(searchConceptName);
                return res.status(200).json({concepts: similarConceptIds});
            default:
            case 'exact':
                const exactConceptIds = await conceptSer.fetchConceptIdsAndNamesByExactConceptName(searchConceptName);
                return res.status(200).json({concepts: exactConceptIds});
        }

    } catch (error) {
        console.error(error);
        res.status(404).json({
            message: "Concept not found"
        });
    }
})

/**
 * Fetch concept name and ids by conceptId
 */
router.get('/concept/:conceptId', async (req, res) => {
    try{
        const conceptId = req.params.conceptId;
        console.log(conceptId)

        const conceptSer = new conceptService();
        const conceptIds = await conceptSer.fetchConceptNameById(parseInt(conceptId));

        return res.status(200).json(conceptIds);

    } catch (err) {
        console.error(err);
        res.status(404).json({
            message: "Concept not found"
        });
    }
})

/**
 * Fetch articles using related concepts by conceptId
 */
router.get('/concept/:conceptId/articles', async (req, res) => {
    try{
        const conceptId = req.params.conceptId;

        const conceptSer = new conceptService();
        const articleIds = await conceptSer.fetchArticlesByConceptId(parseInt(conceptId));

        return res.status(200).json(articleIds);
    } catch (err) {
        console.error(err);
        res.status(404).json({
            message: "Concept not found"
        });
    }
})

module.exports = router;
