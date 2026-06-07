const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.like.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.follow.deleteMany({});
  // We won't delete the user we just created (the user is probably id 1 or we can just delete all but the actual user, but let's just delete all to be safe or not delete users. Let's not delete existing users so the user's login still works).
  // Actually, better to just keep existing users and add new ones.

  // 2. Create Dummy Users
  console.log('👥 Creating dummy users...');
  const users = [];
  const passwordHash = await bcrypt.hash('password123', 10);
  
  for (let i = 0; i < 15; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.username().toLowerCase().replace(/[^a-z0-9_]/g, ''),
        email: faker.internet.email(),
        password: passwordHash,
        avatar: faker.image.avatar(),
        bio: faker.person.bio(),
      }
    });
    users.push(user);
  }

  // Also get the real user if they exist
  const allUsers = await prisma.user.findMany();

  // 3. Create Posts
  console.log('📸 Creating dummy posts...');
  const posts = [];
  // Using picsum or standard faker image urls, wait standard faker uses standard urls.
  // We need absolute URLs for external images since we use /uploads/ for local.
  // Wait, in Post.jsx I hardcoded: src={`http://localhost:5000${post.imageUrl}`}
  // That will break for external URLs. I should update Post.jsx to handle both external and local URLs.
  // I will do that in the next step.
  for (let i = 0; i < 40; i++) {
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    const post = await prisma.post.create({
      data: {
        imageUrl: `https://picsum.photos/seed/${faker.string.uuid()}/800/800`,
        caption: faker.lorem.sentences(2) + ' ' + faker.helpers.arrayElements(['#nature', '#photography', '#vibe', '#aesthetic', '#lifestyle'], 2).join(' '),
        userId: randomUser.id,
      }
    });
    posts.push(post);
  }

  // 4. Create Likes & Comments
  console.log('❤️ Creating likes and comments...');
  for (const post of posts) {
    // Random likes
    const numLikes = faker.number.int({ min: 3, max: 12 });
    const likedUsers = faker.helpers.arrayElements(allUsers, numLikes);
    for (const user of likedUsers) {
      await prisma.like.create({
        data: {
          userId: user.id,
          postId: post.id
        }
      });
    }

    // Random comments
    const numComments = faker.number.int({ min: 1, max: 6 });
    for (let i = 0; i < numComments; i++) {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      await prisma.comment.create({
        data: {
          text: faker.lorem.sentence(),
          userId: randomUser.id,
          postId: post.id
        }
      });
    }
  }

  // 5. Create Follows
  console.log('🤝 Creating follow relationships...');
  for (const follower of allUsers) {
    const numFollowing = faker.number.int({ min: 3, max: 8 });
    const followingUsers = faker.helpers.arrayElements(allUsers.filter(u => u.id !== follower.id), numFollowing);
    
    for (const following of followingUsers) {
      await prisma.follow.create({
        data: {
          followerId: follower.id,
          followingId: following.id
        }
      });
    }
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
