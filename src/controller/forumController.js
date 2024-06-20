const db = require('../services/firestore');
const crypto = require('crypto');
const { copyImageInGCS } = require('./GCS');

const postToForum = async (req, res) => {
  const userId = req.user.userId;
  const { predictionId } = req.params;
  const { caption } = req.body;

  if (!caption) {
    return res.status(400).json({ error: true, message: 'Caption is required.' });
  }

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: true, message: 'User not found.' });
    }
    const userData = userDoc.data();
    const userName = userData.name;

    const predictionDoc = await db.collection('users').doc(userId).collection('predictions').doc(predictionId).get();
    if (!predictionDoc.exists) {
      return res.status(404).json({ error: true, message: 'Prediction not found.' });
    }
    const predictionData = predictionDoc.data();
    const imagePrediction = predictionData.imageUrl;
    const plantPrediction = predictionData.plant;
    const resultPrediction = predictionData.prediction;

    const forumImageUrl = await copyImageInGCS(imagePrediction, `forum/${userId}`);

    const postId = `forum-${crypto.randomUUID()}`;
    const postData = {
      id: postId,
      userName: userName,
      imagePrediction: forumImageUrl,
      plantPrediction: plantPrediction,
      resultPrediction: resultPrediction,
      caption: caption,
      timestamp: new Date()
    };

    await db.collection('forum').doc(postId).set(postData);

    return res.status(201).json({ error: false, postData });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

const getForumData = async (req, res) => {
  try {
    const forumSnapshot = await db.collection('forum').get();

    if (forumSnapshot.empty) {
      return res.status(200).json({ error: false, forumData: [] });
    }

    const forumData = await Promise.all(
      forumSnapshot.docs.map(async (doc) => {
        const forumPost = doc.data();
        const commentsSnapshot = await db.collection('forum').doc(forumPost.id).collection('comments').get();
        const comments = commentsSnapshot.docs.map((commentDoc) => commentDoc.data());

        return {
          ...forumPost,
          comments
        };
      })
    );

    return res.status(200).json({ error: false, forumData });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

const postCommentToForum = async (req, res) => {
  const userId = req.user.userId;
  const { forumId } = req.params;
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).json({ error: true, message: 'Comment is required.' });
  }

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: true, message: 'User not found.' });
    }
    const userData = userDoc.data();
    const userName = userData.name;

    const forumRef = db.collection('forum').doc(forumId);
    const forumDoc = await forumRef.get();
    if (!forumDoc.exists) {
      return res.status(404).json({ error: true, message: 'Forum post not found.' });
    }

    const commentId = `comment-${crypto.randomUUID()}`;
    const commentData = {
      id: commentId,
      userName: userName,
      comment: comment,
      timestamp: new Date(),
    };

    await forumRef.collection('comments').doc(commentId).set(commentData);

    return res.status(201).json({ error: false, commentData });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

const getForumById = async (req, res) => {
  const { forumId } = req.params;

  try {
    const forumDoc = await db.collection('forum').doc(forumId).get();

    if (!forumDoc.exists) {
      return res.status(404).json({ error: true, message: 'Forum post not found.' });
    }

    const forumData = forumDoc.data();
    const commentsSnapshot = await db.collection('forum').doc(forumId).collection('comments').get();
    const comments = commentsSnapshot.docs.map((commentDoc) => commentDoc.data());

    return res.status(200).json({ error: false, forumData: { ...forumData, comments } });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

module.exports = { postToForum, getForumData, getForumById, postCommentToForum };
