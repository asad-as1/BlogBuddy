const Post = require('../models/post');
const User = require('../models/user');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, categories, media, isPublished } = req.body;
    const user = req.user;

    const newPost = new Post({
      author: user._id,
      title,
      content,
      media: {
        url: media.url,
        isVideo: media.isVideo || false,
      },
      categories,
      isPublished,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating post', error });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate('author', 'username name').exec();

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
};

// Update a post by ID
exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { title, content, categories, media, isPublished } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        content,
        media: {
          url: media.url,
          isVideo: media.isVideo || false,
        },
        categories,
        isPublished,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
  }
};

// Delete a post by ID
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user is the author of the post or an admin
    if (post.author.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    // Delete the post
    const deletedPost = await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
};


// Like a post
exports.likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: 'You already liked this post' });
    }

    post.likes.push(userId);
    await post.save();

    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.likes.includes(userId)) {
      return res.status(400).json({ message: 'You have not liked this post' });
    }

    post.likes.pull(userId);
    await post.save();

    res.status(200).json({ message: 'Post unliked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unliking post', error });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    // console.log(req.body)
    const { comment } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: userId,
      comment,
      createdAt: Date.now()
    });

    await post.save();
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error });
  }
};

// Delete a comment from a post
exports.deleteComment = async (req, res) => {
  try {
    // console.log(req.user.role)
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const userId = req.user._id;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find the comment to check authorization
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if the user is authorized to delete the comment
    if (comment.user.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this comment' });
    }

    // Use $pull to remove the comment by its _id
    await Post.updateOne(
      { _id: postId },
      { $pull: { comments: { _id: commentId } } }
    );

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error });
  }
};




// Fetch the list of users who liked a post
exports.fetchLikesList = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate('likes', 'username'); // Populating only the 'username' field of the User

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ likes: post.likes });
  } catch (error) {
    console.error('Error fetching likes list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch the list of comments on a post
exports.fetchCommentsList = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate({
      path: 'comments.user', // Path to the user field within comments
      select: 'username' // Select only the 'username' field from the User model
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ comments: post.comments });
  } catch (error) {
    console.error('Error fetching comments list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
