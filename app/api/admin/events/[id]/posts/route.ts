import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { initializeDatabase } from '@/lib/db-init';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await initializeDatabase();
    
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { Post, Guest, Like, Comment } = require('@/lib/model/models');
    
    const posts = await Post.findAll({
      where: { wedding_event_id: params.id },
      include: [
        {
          model: Guest,
          attributes: ['name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'content', 'image_url', 'video_url', 'createdAt']
    });

    // Get counts for each post
    const postsWithCounts = await Promise.all(
      posts.map(async (post: any) => {
        const [likesCount, commentsCount] = await Promise.all([
          Like.count({ where: { post_id: post.id } }),
          Comment.count({ where: { post_id: post.id } })
        ]);

        return {
          id: post.id,
          content: post.content,
          image_url: post.image_url,
          video_url: post.video_url,
          createdAt: post.createdAt,
          guest: {
            name: post.guest?.name || 'Unknown Guest',
            email: post.guest?.email || ''
          },
          likes_count: likesCount,
          comments_count: commentsCount
        };
      })
    );

    return NextResponse.json({ posts: postsWithCounts });
  } catch (error) {
    console.error('Admin posts fetch error:', error);
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
  }
}