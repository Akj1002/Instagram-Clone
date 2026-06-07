const prisma = require('../prismaClient');

const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const newPost = await prisma.post.create({
      data: {
        caption,
        imageUrl,
        userId: req.user.userId
      },
      include: {
        user: {
          select: { username: true, avatar: true }
        }
      }
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, username: true, avatar: true }
        },
        likes: true,
        savedBy: {
          where: { userId: req.user.userId }
        },
        _count: {
          select: { comments: true, likes: true }
        }
      }
    });

    res.json(posts);
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        comments: {
          include: {
            user: { select: { id: true, username: true, avatar: true } }
          },
          orderBy: { createdAt: 'desc' }
        },
        likes: true
      }
    });

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        savedBy: {
          where: { userId: req.user.userId }
        },
        _count: { select: { comments: true, likes: true } }
      }
    });

    res.json(posts);
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getExplorePosts = async (req, res) => {
  try {
    // For explore, we'll just fetch random recent posts for now.
    // In a real app, this would be based on an algorithm.
    const posts = await prisma.post.findMany({
      take: 30,
      orderBy: { createdAt: 'desc' },
      include: {
        savedBy: {
          where: { userId: req.user.userId }
        },
        _count: { select: { comments: true, likes: true } }
      }
    });
    
    // Shuffle the posts to make it feel random
    const shuffled = posts.sort(() => 0.5 - Math.random());

    res.json(shuffled);
  } catch (error) {
    console.error('Get explore posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const toggleSavePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const existingSave = await prisma.savedPost.findUnique({
      where: { userId_postId: { userId, postId: id } }
    });

    if (existingSave) {
      await prisma.savedPost.delete({
        where: { userId_postId: { userId, postId: id } }
      });
      res.json({ message: 'Post unsaved', isSaved: false });
    } else {
      await prisma.savedPost.create({
        data: { userId, postId: id }
      });
      res.json({ message: 'Post saved', isSaved: true });
    }
  } catch (error) {
    console.error('Save post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user.userId;

    const saved = await prisma.savedPost.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        post: {
          include: {
            _count: { select: { comments: true, likes: true } }
          }
        }
      }
    });

    res.json(saved.map(s => s.post));
  } catch (error) {
    console.error('Get saved posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPost,
  getFeed,
  getPostById,
  getUserPosts,
  getExplorePosts,
  toggleSavePost,
  getSavedPosts
};
