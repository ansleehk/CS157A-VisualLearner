// Import the AiDetectArticle class
const articleService = require('../../services/articleService');

async function testAiDetectArticle() {
    // Define a sample article content
    const articleContent = 'This is a test article about machine learning and artificial intelligence.';

    // Create a new instance of the AiDetectArticle class
    const aiDetectArticle = new articleService.AiDetectArticle(articleContent);

    // Test the identifyMediumArticleFieldsOfStudy method
    const fieldsOfStudy = await aiDetectArticle.identifyMediumArticleFieldsOfStudy();
    console.log('Fields of study:', fieldsOfStudy);

    // Test the identifyMediumArticleConcepts method
    const concepts = await aiDetectArticle.identifyMediumArticleConcepts();
    console.log('Concepts:', concepts);

    // Test the generateConceptMap method
    const conceptMap = await aiDetectArticle.generateConceptMap(concepts);    console.log('Concept map:', conceptMap);

}

// testAiDetectArticle();

async function testFetchMediumArticleFromRapidApi() {
  // Define a sample article ID
  const articleID = 'da97f08f6aa6';

  // Create a new instance of the FetchMediumArticleFromRapidApi class
  const fetchMediumArticle = new articleService.FetchMediumArticleFromRapidApi();

  // Call the fetchMediumArticleContent method
  const content = await fetchMediumArticle.fetchMediumArticleContent(articleID);
  console.log('Article content:', content);

  // Call the checkMediumArticleExists method
  const exists = await fetchMediumArticle.checkMediumArticleExists(articleID);
  console.log('Article exists:', exists);

  // Call the fetchMediumArticleInfo method
  const info = await fetchMediumArticle.fetchMediumArticleInfo(articleID);
  console.log('Article info:', info);
}

// Call the testFetchMediumArticleFromRapidApi function
testFetchMediumArticleFromRapidApi();