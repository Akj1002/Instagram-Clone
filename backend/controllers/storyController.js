const prisma = require('../prismaClient');

const createStory = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const userId = req.user.userId;

    // Expires in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const story = await prisma.story.create({
      data: {
        imageUrl,
        userId,
        expiresAt
      },
      include: {
        user: { select: { id: true, username: true, avatar: true } }
      }
    });

    res.status(201).json(story);
  } catch (error) {
    console.error('Create story error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getFeedStories = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get following IDs
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });
    const followingIds = following.map(f => f.followingId);
    
    // Include self
    followingIds.push(userId);

    const stories = await prisma.story.findMany({
      where: {
        userId: { in: followingIds },
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true, avatar: true } }
      }
    });

    res.json(stories);
  } catch (error) {
    console.error('Get feed stories error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createStory,
  getFeedStories
};
