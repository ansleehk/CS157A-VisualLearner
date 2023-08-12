const conceptRepo = require('../../repos/conceptRepo');

async function testConceptRepo() {
  // Define a sample concept name
  const conceptName = 'Extreme heat';

  // // Call the fetchArticlesByExactConceptName method
  // const exactArticles = await conceptRepo.fetchArticlesByExactConceptName(conceptName);
  // console.log('Exact articles:', exactArticles);

  // // Call the fetchArticlesBySimilarConceptName method
  // const similarArticles = await conceptRepo.fetchArticlesBySimilarConceptName(conceptName);
  // console.log('Similar articles:', similarArticles);

  // // Call the checkConceptExists method
  // const exists = await conceptRepo.checkConceptExists(conceptName);
  // console.log('Concept exists:', exists);

  // // Call the createConcept method
  // await conceptRepo.createConcept(conceptName);

  // // Call the createConceptConceptRelationship method
  // const conceptName1 = 'deep learning';
  // const conceptName2 = 'neural networks';
  // const relationshipDescription = 'are related to';
  // await conceptRepo.createConceptConceptRelationship(conceptName1, conceptName2, relationshipDescription);
  
  const articleID = "da97f08f6aa6";

  // Call the checkConceptArticleRelationshipExists method
  const isConceptArticleRelationshipExists = await conceptRepo.checkConceptArticleRelationshipExists(conceptName, articleID);
  console.log('Concept-article relationship exists:', isConceptArticleRelationshipExists);
}

// Call the testConceptRepo function
testConceptRepo();