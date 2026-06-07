const prisma = require('../prismaClient');

const createNote = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.userId;

    // A note expires in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Usually users only have one active note, so we can delete existing ones
    await prisma.note.deleteMany({
      where: { userId }
    });

    const note = await prisma.note.create({
      data: {
        text,
        userId,
        expiresAt
      },
      include: {
        user: { select: { id: true, username: true, avatar: true } }
      }
    });

    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getNotes = async (req, res) => {
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

    const notes = await prisma.note.findMany({
      where: {
        userId: { in: followingIds },
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true, avatar: true } }
      }
    });

    res.json(notes);
  } catch (error) {
    console.error('Get notes error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createNote,
  getNotes
};
