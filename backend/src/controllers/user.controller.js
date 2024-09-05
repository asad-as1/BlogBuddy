const User = require('../models/user');
const Post = require('../models/post')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config(); 


// Register a new user
exports.register = async (req, res) => {
  try {
    // console.log(req.body)
    const { username, name, email, password, profilePicture, bio } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const newUser = new User({ username, name, email, password, profilePicture, bio });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login an existing user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.SECRET, {
      expiresIn: '7d'
    });
   
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        role: user.role,
        email: user.email, 
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Logout the user
exports.logout = (req, res) => {
  try {
    // Clear the token from the client-side (assuming it's stored in cookies)
    res.clearCookie('token'); // or res.cookie('token', '', { expires: new Date(0) });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('posts'); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getUsername = async (req, res) => {
  try {
    const {username} = req.params;
    // console.log(username)
    const user = await User.findOne({ username }).select('-password').populate('posts');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isOwnProfile = req.user.username === username;
    res.status(200).json({ user, isOwnProfile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId  = req.body?.author;
    // console.log(userId)
    const user = await User.findById(userId).select('-password'); 
    if (!user) {
      return res.status(404).json({ message: 'User not found!!' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, name, bio, profilePicture } = req.body;
    // console.log(req.user._id.toString())

    // Find the user by ID and update the fields
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id.toString(),
      { username, name, bio, profilePicture },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude the password field

    res.status(201).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Delete a user account and associated data
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    // console.log(userId)
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    await Post.deleteMany({ author: userId });

    // Inside the deleteUser function
    await Post.updateMany({ likes: userId }, { $pull: { likes: userId } });
    await Post.updateMany({ 'comments.user': userId }, { $pull: { comments: { user: userId } } });
    

    res.status(200).json({ message: 'User account and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.addPostToFavorites = async (req, res) => {
  try {
    const userId = req.user.id; // assuming you have user ID from the request (e.g., via JWT)
    const postId = req.params.postId; // post ID from the request params
    
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (user.favourites.includes(postId)) {
      return res.status(400).json({ message: 'Post is already in favorites' });
    }

    user.favourites.push(postId);
    await user.save();

    return res.status(200).json({ message: 'Post added to favorites', favourites: user.favourites });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.RemoveFromFavorites = async (req, res) => {
  try {
    const userId = req.user.id; 
    const postId = req.params.postId; 
    
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (!user.favourites.includes(postId)) {
      return res.status(400).json({ message: 'Post is not in favorites' });
    }

    // remove the post from the user's favorites
    user.favourites.pull(postId);
    await user.save();

    return res.status(200).json({ message: 'Post removed from favorites', favorites: user.favourites });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.isPostInFavourites = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId; // post ID from the request params

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the post ID is in the user's favorites
    const isFavourite = user.favourites.includes(postId);

    if (isFavourite) {
      return res.status(200).json({ message: 'Post is in favourites', isFavourite: true });
    } else {
      return res.status(200).json({ message: 'Post is not in favourites', isFavourite: false });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fetch the list of on a user
exports.fetchFavourites = async (req, res) => {
  const userId = req.user._id; 
  
  try {
    const user = await User.findById(userId).populate('favourites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ favourites: user.favourites });  
  } catch (error) {
    console.error('Error fetching favourites:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.searchUsers = async (req, res) => {
  // console.log(req)
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    // Perform search based on the query (e.g., username or name)
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } }, // Case-insensitive search for username
        { name: { $regex: query, $options: 'i' } } // Case-insensitive search for name
      ]
    });

    res.json(users);
  } catch (err) {
    console.error('Error searching users:', err);
    res.status(500).json({ error: 'Failed to search users' });
  }
};

