const pool = require('../db');

async function saveLearnerFieldsOfStudy(learnerID, fields) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query('DELETE FROM LearnerKnownField WHERE LearnerID = ?', [learnerID]);
    for (const field of fields) {
      const [result] = await connection.query('SELECT FieldID FROM StudyField WHERE FieldName = ?', [field]);
      if (result) {
        await connection.query('INSERT INTO LearnerKnownField (LearnerID, FieldID) VALUES (?, ?)', [learnerID, result.FieldID]);
      }
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function getLearnerToReadArticles(learnerID) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(`
      SELECT DISTINCT a.ArticleID, a.Title
      FROM Article a
      JOIN ArticleRelatedField arf ON a.ArticleID = arf.ArticleID
      JOIN LearnerKnownField l ON arf.FieldID = l.FieldID
      JOIN UserFollow uf ON l.LearnerID = uf.FolloweeID
      WHERE uf.FollowerID = ? AND a.ArticleID NOT IN (
        SELECT ArticleID FROM LearnerReadArticle WHERE LearnerID = ?
      )
    `, [learnerID, learnerID]);
    return result;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

async function getLearnerReadArticles(learnerID) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(`
      SELECT a.ArticleID, a.Title
      FROM Article a
      JOIN LearnerReadArticle lra ON a.ArticleID = lra.ArticleID
      WHERE lra.LearnerID = ?
    `, [learnerID]);
    return result;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  saveLearnerFieldsOfStudy,
  getLearnerToReadArticles,
  getLearnerReadArticles
};