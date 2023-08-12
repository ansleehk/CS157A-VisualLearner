const pool = require('../config/database');

async function followUser(followerID, followeeID) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query('SELECT * FROM Learner WHERE LearnerID = ?', [followeeID]);
    if (!result) {
      throw new Error('User not found');
    }
    await connection.query('INSERT INTO UserFollow (FollowerID, FolloweeID) VALUES (?, ?)', [followerID, followeeID]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function getFollowableLearners(learnerID) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(`
      SELECT l.LearnerID, l.Username, GROUP_CONCAT(DISTINCT sf.FieldName ORDER BY sf.FieldName SEPARATOR ', ') AS KnownFields
      FROM Learner l
      JOIN LearnerKnownField lsf ON l.LearnerID = lsf.LearnerID
      JOIN StudyField sf ON lsf.FieldID = sf.FieldID
      WHERE l.LearnerID <> ? AND l.LearnerID NOT IN (
        SELECT FolloweeID FROM UserFollow WHERE FollowerID = ?
      )
      GROUP BY l.LearnerID, l.Username
    `, [learnerID, learnerID]);
    return result;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

async function getReadArticles(userID) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(`
      SELECT a.ArticleID, a.Title
      FROM Article a
      JOIN LearnerReadArticle lra ON a.ArticleID = lra.ArticleID
      WHERE lra.LearnerID = ?
    `, [userID]);
    if (result.length === 0) {
      throw new Error('User not found');
    }
    return result;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  followUser,
  getFollowableLearners,
  getReadArticles
};