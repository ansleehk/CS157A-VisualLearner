const conceptRepo = require('../repos/conceptRepo');
const articleService = require('./articleService');

class ConceptService{
    async fetchArticlesByConceptId(conceptId){
        const articleListByConceptId = await conceptRepo.fetchArticlesByConceptId(conceptId);
        return articleListByConceptId;
    }
    async fetchConceptIdsAndNamesByExactConceptName(conceptName){
        const conceptIds = await conceptRepo.fetchConceptIdsAndNamesByExactConceptName(conceptName);
        return conceptIds;
    }
    async fetchConceptIdsAndNamesBySimilarConceptName(conceptName){
        const conceptIds = await conceptRepo.fetchConceptIdsAndNamesBySimilarConceptName(conceptName);
        return conceptIds;
    }
    async fetchConceptNameById(conceptId){
        const conceptName = await conceptRepo.fetchConceptNameById(conceptId);
        return conceptName;
    }
}

module.exports = ConceptService;