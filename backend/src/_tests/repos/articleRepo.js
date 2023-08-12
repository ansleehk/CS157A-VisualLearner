const articleRepo = require('../../repos/articleRepo');

async function testArticleRepo() {
  // Define a sample article ID
  const articleID = 'da97f08f6aa6';

  // Call the checkArticleExists function
  const articleExists = await articleRepo.checkArticleExists(articleID);
  console.log(articleExists); // true or false

  // Call the fetchArticle function
  const article = await articleRepo.fetchArticle(articleID);
  console.log(article); // { ArticleID: '123456', Title: 'Sample Article', Content: 'Lorem ipsum...', SourceLink: 'https://example.com/sample-article' }

  // Call the fetchArticleConceptMap function
  const conceptMapCode = await articleRepo.fetchArticleConceptMap(articleID);
  console.log(conceptMapCode); // 'graph TD\nA[Sample Concept A] -->|is related to| B[Sample Concept B]'

  // Call the fetchArticleConceptNames function
  const conceptNames = await articleRepo.fetchArticleConceptNames(articleID);
  console.log(conceptNames); // ['Sample Concept A', 'Sample Concept B']

  // Call the fetchArticleFields function
  const fields = await articleRepo.fetchArticleFields(articleID);
  console.log(fields); // [{ FieldName: 'Sample Field A' }, { FieldName: 'Sample Field B' }]

  // Define a sample article object
  // const articleObj = {
  //   id: '123456',
  //   title: 'Sample Article',
  //   url: 'https://example.com/sample-article',
  //   content: 'Lorem ipsum...',
  //   fieldsOfStudy: ['Sample Field A', 'Sample Field B'],
  //   conceptAndRelationships: [
  //     { conceptA: 'Sample Concept A', conceptB: 'Sample Concept B', relationship: 'is related to' }
  //   ],
  //   conceptMap: 'graph TD\nA[Sample Concept A] -->|is related to| B[Sample Concept B]'
  // };

  // // Create a new article in the database
  // const createNewArticle = new articleRepo.CreateNewArticleToDatabase(articleObj.id, articleObj.title, articleObj.url, articleObj.content, articleObj.fieldsOfStudy, articleObj.conceptAndRelationships, articleObj.conceptMap);
  // await createNewArticle.saveArticleToDatabase();
  // console.log("Article created successfully");
}

// Call the testArticleRepo function
testArticleRepo();