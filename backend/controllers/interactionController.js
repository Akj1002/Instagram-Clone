const prisma = require('../prismaClient');

const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const existingLike = await prisma.like.findFirst({
      where: { postId, userId }
    });

    let like;
    let action;

    if (existingLike) {
      // Unlike
      await prisma.like.delete({ where: { id: existingLike.id } });
      action = 'unliked';
    } else {
      // Like
      like = await prisma.like.create({
        data: { postId, userId }
      });
      action = 'liked';

      // Real-time notification logic
      const io = req.app.get('socketio');
      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (post && post.userId !== userId) {
        await prisma.notification.create({
          data: {
            type: 'LIKE',
            userId: post.userId,
            triggerById: userId,
            postId: postId
          }
        });

        io.to(post.userId).emit('notification', {
          type: 'LIKE',
          postId,
          fromUserId: userId
        });
      }
    }

    // Get new like count
    const likesCount = await prisma.like.count({ where: { postId } });

    res.json({ action, likesCount });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const commentOnPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const comment = await prisma.comment.create({
      data: { text, postId, userId },
      include: {
        user: { select: { id: true, username: true, avatar: true } }
      }
    });

    // Real-time notification
    const io = req.app.get('socketio');
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (post && post.userId !== userId) {
      await prisma.notification.create({
        data: {
          type: 'COMMENT',
          userId: post.userId,
          triggerById: userId,
          postId: postId,
          text: text.substring(0, 50)
        }
      });

      io.to(post.userId).emit('notification', {
        type: 'COMMENT',
        postId,
        fromUserId: userId,
        text
      });
    }
    
    // Broadcast comment to everyone looking at this post
    io.emit(`post:${postId}:comment`, comment);

    res.status(201).json(comment);
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  likePost,
  commentOnPost
};
