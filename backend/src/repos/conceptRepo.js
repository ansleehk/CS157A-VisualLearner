const db = require('../db');

const fetchConceptNameById = async(conceptId) => {
    const query = 'SELECT ConceptName FROM Concept WHERE ConceptID = ?';
    const params = [conceptId];
    const result = (await db.query(query, params))[0];
    return result.map(row => row.ConceptName);
}

const fetchConceptIdsAndNamesByExactConceptName = async(conceptName) => {
    const query = 'SELECT ConceptID, ConceptName FROM Concept WHERE ConceptName = ?';
    const params = [conceptName];
    const result = (await db.query(query, params))[0];
    return result.map(row => ({conceptId: row.ConceptID, conceptName: row.ConceptName}));
}

/**
 * Definition of a similar concept name:
 * 1. The similar concept name must contain the concept name.
 * 2. The similar concept name must be contained in the concept name.
 */
const fetchConceptIdsAndNamesBySimilarConceptName = async(conceptName) => {
    const query = 'SELECT ConceptID, ConceptName FROM Concept WHERE ConceptName LIKE ?';
    const params = [`%${conceptName}%`];
    const result = (await db.query(query, params))[0];
    return result.map(row => row.ConceptID);
}

const fetchArticlesByConceptId = async(conceptId) => {
    const query = 'SELECT ArticleID FROM ArticleConcept WHERE ConceptID = ?';
    const params = [conceptId];
    const result = (await db.query(query, params))[0];
    return result.map(row => row.ArticleID);
}


/**
 * Check if the concept exists in the database by the given name.
 * 
 * @async
 * @function
 * @param {string} conceptName - The name of the concept to check.
 * @return {Promise<boolean>} A promise that resolves with a boolean value indicating whether the concept exists.
 * @throws {Error} If there's an error checking the concept.
 */
const checkConceptExists = async(conceptName) => {
    const query = 'SELECT COUNT(*) AS count FROM Concept WHERE ConceptName = ?';
    const params = [conceptName];
    const result = await db.query(query, params);
    return result[0][0].count > 0;
}

/**
 * Create a new concept in the database by the given name.
 * 
 * @async
 * @function
 * @param {string} conceptName - The name of the concept to create.
 * @return {Promise<void>} A promise that resolves when the concept is created.
 * @throws {Error} If there's an error creating the concept.
 */
const createConcept = async(conceptName) => {
    const query = 'INSERT INTO Concept (ConceptName) VALUES (?)';
    const params = [conceptName];
    await db.query(query, params);
}

/**
 * Create a new concept-concept relationship in the database.
 * 
 * @async
 * @function
 * @param {string} conceptName1 - The name of the first concept.
 * @param {string} conceptName2 - The name of the second concept.
 * @param {string} conceptRelationshipDescription - The description of the relationship between the two concepts.
 * @return {Promise<void>} A promise that resolves when the concept-concept relationship is created.
 * @throws {Error} If there's an error creating the concept-concept relationship.
 */
const createConceptConceptRelationship = async(conceptName1, conceptName2, conceptRelationshipDescription) => {
    const query = `INSERT INTO ConceptRelationship (Concept1ID, Concept2ID, RelationshipDescription) 
                    VALUES ((SELECT ConceptID FROM Concept WHERE ConceptName = ? LIMIT 1), 
                    (SELECT ConceptID FROM Concept WHERE ConceptName = ? LIMIT 1), ?)`;
    const params = [conceptName1, conceptName2, conceptRelationshipDescription];
    await db.query(query, params);
}

const checkConceptArticleRelationshipExists = async(conceptName, articleID) => {
    const query = `SELECT COUNT(*) AS count FROM ArticleConcept WHERE ConceptID = (SELECT ConceptID FROM Concept WHERE ConceptName = ? LIMIT 1) AND ArticleID = ?`;
    const params = [conceptName, articleID];
    const result = await db.query(query, params);
    return result[0][0].count > 0;
}

module.exports = {
    fetchConceptNameById,
    fetchConceptIdsAndNamesByExactConceptName,
    fetchConceptIdsAndNamesBySimilarConceptName,
    fetchArticlesByConceptId,
    createConcept,
    createConceptConceptRelationship,
    checkConceptExists,
    checkConceptArticleRelationshipExists
}