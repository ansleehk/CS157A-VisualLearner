const db = require('../db');
const fieldRepo = require('./fieldRepo')
const conceptRepo = require('./conceptRepo')

/**
 * Checks if an article with the given ID already exists in the database.
 *
 * @async
 * @function
 * @param {string} articleID - The ID of the article.
 * @returns {Promise<boolean>} True if the article already exists, false otherwise.
 * @throws {Error} If there's an error checking the database.
 *
 * @example
 * const articleID = 123;
 * const articleExists = await checkArticleExists(articleID);
 * console.log(articleExists); // true or false
 */
const checkArticleExists = async (articleID) => {
    const query = 'SELECT COUNT(*) AS count FROM Article WHERE ArticleID = ?';
    const params = [articleID];
    const result = await db.query(query, params);
    return result[0][0].count > 0;
};

/**
 * Fetches the article with the given ID from the database.
 *
 * @async
 * @function
 * @param {string} articleID - The ID of the article.
 * @returns {Promise<Object>} An object containing the article's ID, title, content, and sourceLink.
 * @throws {Error} If there's an error fetching the article.
 */
const fetchArticle = async (articleID) => {
    const query = 'SELECT ArticleID, Title, Content, SourceLink FROM Article WHERE ArticleID = ?';
    const params = [articleID];
    const result = await db.query(query, params);
    return result[0][0];
};


/**
 * Fetches the concept map code in Mermaid format for the article with the given ID from the database.
 *
 * @async
 * @function
 * @param {string} articleID - The ID of the article.
 * @returns {Promise<string>} The concept map code in Mermaid format for the article.
 * @throws {Error} If there's an error fetching the concept map code.
 *
 * @example
 * const articleID = 123;
 * const conceptMapCode = await fetchArticleConceptMap(articleID);
 * console.log(conceptMapCode); 
 */
const fetchArticleConceptMap = async (articleID) => {
    const query = 'SELECT ConceptMapCode FROM Article WHERE ArticleID = ?';
    const params = [articleID];
    const result = await db.query(query, params);
    return result[0];
}

/**
 * Adds a concept map for an article to the database.
 * 
 * @async
 * @function
 * @param {string} articleID - The ID of the article.
 * @param {string} conceptMapMermaidCode - The Mermaid code for the concept map.
 * @returns {Promise<void>} A promise that resolves when the concept map is saved.
 */
const addArticleConceptMap = async (articleID, conceptMapMermaidCode) => {
    const query = 'UPDATE Article SET ConceptMapCode = ? WHERE ArticleID = ?';
    const params = [conceptMapMermaidCode, articleID];
    await db.query(query, params);
};

/**
 * Fetches the names of all the concepts related to the article with the given ID from the database.
 *
 * @async
 * @function
 * @param {number} articleID - The ID of the article.
 * @returns {Promise<Array<string>>} An array of strings representing the names of the concepts related to the article.
 * @throws {Error} If there's an error fetching the concept names.
 *
 * @example
 * const articleID = 123;
 * const conceptNames = await fetchArticleConceptNames(articleID);
 * console.log(conceptNames); 
 */
const fetchArticleConceptNames = async (articleID) => {
    const query = `
        SELECT Concept.ConceptName
        FROM ArticleConcept
        INNER JOIN Concept ON ArticleConcept.ConceptID = Concept.ConceptID
        WHERE ArticleConcept.ArticleID = ?
    `;
    const params = [articleID];
    const result = (await db.query(query, params))[0];
    return result.map(row => row.ConceptName);
};


/**
 * Fetches the names and ids of all the concepts related to the article with the given ID from the database.
 */
const fetchArticleConcepts = async (articleID) => {
    const query = `
        SELECT Concept.ConceptName, Concept.ConceptID
        FROM ArticleConcept
        INNER JOIN Concept ON ArticleConcept.ConceptID = Concept.ConceptID
        WHERE ArticleConcept.ArticleID = ?
    `;
    const params = [articleID];
    const result = (await db.query(query, params))[0];
    return result.map(row => ({name: row.ConceptName, id: row.ConceptID}));
};

/**
 * Fetches all the names of fields related to the article with the given ID from the database.
 *
 * @async
 * @function
 * @param {string} articleID - The ID of the article.
 * @returns {Promise<Array<Object>>} An array of objects representing the fields related to the article.
 * @throws {Error} If there's an error fetching the fields.
 *
 * @example
 * const articleID = 123;
 * const fields = await fetchArticleFields(articleID);
 * console.log(fields); 
 */
const fetchArticleFieldNames = async (articleID) => {
    const query = `
        SELECT StudyField.FieldName
        FROM ArticleRelatedField
        INNER JOIN StudyField ON ArticleRelatedField.FieldID = StudyField.FieldID
        WHERE ArticleRelatedField.ArticleID = ?
    `;
    const params = [articleID];
    const result = (await db.query(query, params))[0];
    return result.map(row => row.FieldName);
};

const fetchArticleFields = async (articleID) => {
    const query = `
        SELECT StudyField.FieldName, StudyField.FieldID
        FROM ArticleRelatedField
        INNER JOIN StudyField ON ArticleRelatedField.FieldID = StudyField.FieldID
        WHERE ArticleRelatedField.ArticleID = ?
    `;
    const params = [articleID];
    const result = (await db.query(query, params))[0];
    return result.map(row => ({name: row.FieldName, id: row.FieldID}));
};

class CreateNewArticleToDatabase {
    dbConn;
    /**
     * @constructor
     * @param {string} id - The ID of the article.
     * @param {string} title - The title of the article.
     * @param {string} url - The source URL of the article.
     * @param {string} content - The content of the article.
     * @param {Array<string>} fieldsOfStudy - The fields of study related to the article.
     * @param {Array<Object>} conceptAndRelationships - The concepts and relationships related to the article.
     * @param {string} conceptMap - The concept map code in Mermaid format for the article.
     */
    constructor(id, title, url, content, fieldsOfStudy, conceptAndRelationships, conceptMap){
        this.id = id;
        this.title = title;
        this.url = url;
        this.content = content;
        this.fieldsOfStudy = fieldsOfStudy;
        this.conceptAndRelationships = conceptAndRelationships;
        this.conceptMap = conceptMap;
    }

    async saveArticleToDatabase(){
        try{
            this.dbConn = await db.getConnection();
            await this.createConnTransaction();
            await this.saveEntityArticle();
            await this.saveRelatedStudyField();
            await this.saveRelatedConcept();
            await this.dbConn.commit();
        } catch (error) {
            await this.dbConn.rollback();
            throw error;
        }

    }

    async createConnTransaction(){
        await this.dbConn.beginTransaction();
    }

    async saveEntityArticle(){
        const query = 'INSERT INTO Article (ArticleID, Title, Content, SourceLink, ConceptMapCode) VALUES (?, ?, ?, ?, ?)';
        const params = [this.id, this.title, this.content, this.url, this.conceptMap];
        await this.dbConn.query(query, params);
    }

    async saveRelatedStudyField(){
        for (const field of this.fieldsOfStudy){

            //Check if the field of study exists in the database
            const IS_FIELD_EXIST = await fieldRepo.checkStudyFieldExists(field);

            if (!IS_FIELD_EXIST){
                await fieldRepo.createStudyField(field);
            }
            
            //Create a new relation between the article and the field of study
            const query = 'INSERT INTO ArticleRelatedField (ArticleID, FieldID) VALUES (?, (SELECT FieldID FROM StudyField WHERE FieldName = ? LIMIT 1))';
            const params = [this.id, field];
            await this.dbConn.query(query, params);
        }
    }

    async saveRelatedConcept(){
        for (const conceptRelationship of this.conceptAndRelationships){
            const conceptA = conceptRelationship.conceptA;
            const conceptB = conceptRelationship.conceptB;

            console.log(conceptRelationship)

            //Check if the concept exists in the database
            const IS_CONCEPT_A_EXIST = await conceptRepo.checkConceptExists(conceptA);
            const IS_CONCEPT_B_EXIST = await conceptRepo.checkConceptExists(conceptB);

            if (!IS_CONCEPT_A_EXIST){
                await conceptRepo.createConcept(conceptA);
            }

            if (!IS_CONCEPT_B_EXIST){
                await conceptRepo.createConcept(conceptB);
            }

            //Create a new relation between the article and the concept
            const createArticleConceptRelationshipQuery = 'INSERT INTO ArticleConcept (ArticleID, ConceptID) VALUES (?, (SELECT ConceptID FROM Concept WHERE ConceptName = ? LIMIT 1))';

            const checkConceptArticleRelationshipExistsQuery = 'SELECT COUNT(*) AS count FROM ArticleConcept WHERE ArticleID = ? AND ConceptID = (SELECT ConceptID FROM Concept WHERE ConceptName = ? LIMIT 1)';

            //Check if the relationship between the article and concept exists in the database
            const IS_CONCEPT_A_RELATION_EXIST = (await this.dbConn.query(checkConceptArticleRelationshipExistsQuery, [this.id, conceptA]))[0][0].count > 0;
            console.log(IS_CONCEPT_A_RELATION_EXIST)

            if (!IS_CONCEPT_A_RELATION_EXIST){
                const paramsA = [this.id, conceptA];
                await this.dbConn.query(createArticleConceptRelationshipQuery, paramsA);
            }

            //Check if the relationship between the article and concept exists in the database
            const IS_CONCEPT_B_RELATION_EXIST = (await this.dbConn.query(checkConceptArticleRelationshipExistsQuery, [this.id, conceptB]))[0][0].count > 0;

            console.log(IS_CONCEPT_B_RELATION_EXIST)

            if (!IS_CONCEPT_B_RELATION_EXIST){
                const paramsB = [this.id, conceptB];
                await this.dbConn.query(createArticleConceptRelationshipQuery, paramsB);
            }

            //Create a new relation between conceptA and conceptB with the relationship in between
            await conceptRepo.createConceptConceptRelationship(conceptA, conceptB, conceptRelationship.relationship);
        }
    }

    
}


module.exports = {
    checkArticleExists,
    fetchArticle,
    addArticleConceptMap,
    fetchArticleConceptMap,
    fetchArticleConceptNames,
    fetchArticleFields,
    fetchArticleConcepts,
    fetchArticleFieldNames,
    CreateNewArticleToDatabase
}