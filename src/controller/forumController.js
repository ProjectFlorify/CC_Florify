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
      timestamp: new Date(),
      likes: [],
      numberOfLikes: 0
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

        const whoLikes = await Promise.all(
          forumPost.likes.map(async (like) => {
            const userDoc = await db.collection('users').doc(like.userId).get();
            if (userDoc.exists) {
              return {
                userName: userDoc.data().name,
              };
            } else {
              return {
                userName: 'Unknown',
              };
            }
          })
        );

        return {
          ...forumPost,
          comments,
          likes: whoLikes,
          numberOfLikes: forumPost.likes ? forumPost.likes.length : 0
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

const likeForumPost = async (req, res) => {
  const userId = req.user.userId;
  const { forumId } = req.params;

  try {
    const forumRef = db.collection('forum').doc(forumId);
    const forumDoc = await forumRef.get();

    if (!forumDoc.exists) {
      return res.status(404).json({ error: true, message: 'Forum post not found.' });
    }

    const forumData = forumDoc.data();

    const likesArray = forumData.likes || [];

    const userLiked = likesArray.find((like) => like.userId === userId);
    if (userLiked) {
      return res.status(400).json({ error: true, message: 'You have already liked this post.' });
    }

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: true, message: 'User not found.' });
    }
    const userData = userDoc.data();
    const userName = userData.name;
    
    await forumRef.update({
      likes: [...likesArray, { userId, userName }],
      numberOfLikes: likesArray.length + 1,
    });

    return res.status(200).json({ error: false, message: 'Post liked successfully.' });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

const unlikeForumPost = async (req, res) => {
  const userId = req.user.userId;
  const { forumId } = req.params;

  try {
    const forumRef = db.collection('forum').doc(forumId);
    const forumDoc = await forumRef.get();

    if (!forumDoc.exists) {
      return res.status(404).json({ error: true, message: 'Forum post not found.' });
    }

    const forumData = forumDoc.data();

    const likesArray = forumData.likes || [];

    const userLikedIndex = likesArray.findIndex((like) => like.userId === userId);
    if (userLikedIndex === -1) {
      return res.status(400).json({ error: true, message: 'You have not liked this post.' });
    }

    likesArray.splice(userLikedIndex, 1);

    await forumRef.update({
      likes: likesArray,
      numberOfLikes: likesArray.length,
    });

    return res.status(200).json({ error: false, message: 'Post unliked successfully.' });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

module.exports = { postToForum, getForumData, postCommentToForum, likeForumPost, unlikeForumPost };
