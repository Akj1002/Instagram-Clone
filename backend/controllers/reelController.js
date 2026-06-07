const prisma = require('../prismaClient');

const getReels = async (req, res) => {
  try {
    const reels = await prisma.reel.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true, avatar: true } }
      }
    });

    // Format the response to match the expected frontend structure
    const formattedReels = reels.map(reel => ({
      id: reel.id,
      url: reel.videoUrl,
      user: reel.user.username,
      avatar: reel.user.avatar,
      description: reel.description,
      likes: 0, // Mocked for now, or add likes relation later
      comments: 0,
      song: reel.song || 'Original Audio'
    }));

    res.json(formattedReels);
  } catch (error) {
    console.error('Get reels error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createReel = async (req, res) => {
  try {
    const { videoUrl, description, song } = req.body;
    const userId = req.user.userId;

    const reel = await prisma.reel.create({
      data: {
        videoUrl,
        description,
        song,
        userId
      },
      include: {
        user: { select: { id: true, username: true, avatar: true } }
      }
    });

    res.status(201).json({
      id: reel.id,
      url: reel.videoUrl,
      user: reel.user.username,
      avatar: reel.user.avatar,
      description: reel.description,
      likes: 0,
      comments: 0,
      song: reel.song || 'Original Audio'
    });
  } catch (error) {
    console.error('Create reel error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getReels,
  createReel
};
