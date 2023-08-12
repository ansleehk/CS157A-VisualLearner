const db = require('../db');

/**
 * Check if the field of study exists in the database by the given name.
 * 
 * @async
 * @function
 * @param {string} fieldName - The name of the field of study to check.
 * @return {Promise<boolean>} A promise that resolves with a boolean value indicating whether the field of study exists.
 * @throws {Error} If there's an error checking the field of study.
 */
const checkStudyFieldExists = async(fieldName) => {
    const query = 'SELECT COUNT(*) AS count FROM StudyField WHERE FieldName = ?';
    const params = [fieldName];
    const result = await db.query(query, params);
    return result[0][0].count > 0;
}

/**
 * Create a new field of study in the database by the given name.
 * 
 * @async
 * @function
 * @param {string} fieldName - The name of the field of study to create.
 * @return {Promise<void>} A promise that resolves when the field of study is created.
 * @throws {Error} If there's an error creating the field of study.
 */
const createStudyField = async(fieldName) => {
    const query = 'INSERT INTO StudyField (FieldName) VALUES (?)';
    const params = [fieldName];
    await db.query(query, params);
}
    



module.exports = {
    checkStudyFieldExists,
    createStudyField
}