const prisma = require('../prismaClient');

const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        bio: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: { posts: true, followers: true, following: true }
        }
      }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const followUser = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const currentUserId = req.user.userId;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId
        }
      }
    });

    let action;

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: targetUserId
          }
        }
      });
      action = 'unfollowed';
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: currentUserId,
          followingId: targetUserId
        }
      });
      action = 'followed';

      // Real-time notification
      const io = req.app.get('socketio');
      
      await prisma.notification.create({
        data: {
          type: 'FOLLOW',
          userId: targetUserId,
          triggerById: currentUserId
        }
      });

      io.to(targetUserId).emit('notification', {
        type: 'FOLLOW',
        fromUserId: currentUserId
      });
    }

    // Get updated follower count
    const followersCount = await prisma.follow.count({
      where: { followingId: targetUserId }
    });

    res.json({ action, followersCount });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q } },
          { bio: { contains: q } }
        ]
      },
      select: {
        id: true,
        username: true,
        avatar: true
      },
      take: 20
    });

    res.json(users);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        triggerBy: { select: { id: true, username: true, avatar: true } },
        post: { select: { id: true, imageUrl: true } }
      }
    });

    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, bio, avatar } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username && { username }),
        ...(bio !== undefined && { bio }),
        ...(avatar && { avatar })
      },
      select: { id: true, username: true, bio: true, avatar: true }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Username is already taken' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get users I follow
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });
    const followingIds = following.map(f => f.followingId);
    followingIds.push(userId); // Exclude self

    const suggested = await prisma.user.findMany({
      where: {
        id: { notIn: followingIds }
      },
      take: 5,
      select: { id: true, username: true, avatar: true }
    });

    res.json(suggested);
  } catch (error) {
    console.error('Suggested users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  followUser,
  searchUsers,
  getNotifications,
  updateProfile,
  getSuggestedUsers
};
