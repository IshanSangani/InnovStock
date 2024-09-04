import { useState } from 'react';
import './Feed.css'; // Ensure you have styles for the Feed component

const Feed = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'Alice',
      content: 'Check out this amazing market chart!',
      profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
      timestamp: '2024-08-18T12:34:56',
      chart: 'https://s3.tradingview.com/d/daae0ogh_mid.png',
      jobTitle: 'Financial Analyst',
      verified: true,
    },
    {
      id: 2,
      user: 'Bob',
      content: 'Just made a great investment!',
      profilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
      timestamp: '2024-08-18T14:56:23',
      chart: '',
      jobTitle: 'Investment Banker',
      verified: false,
    },
  ]);
  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      setPosts([
        ...posts,
        {
          id: posts.length + 1,
          user: 'You',
          content: newPost,
          profilePic: 'https://randomuser.me/api/portraits/men/3.jpg',
          timestamp: new Date().toISOString(),
          chart: '',
          jobTitle: 'Your Job Title',
          verified: false,
        },
      ]);
      setNewPost('');
    }
  };

  return (
    <div className="feed">
      <form onSubmit={handlePostSubmit} className="post-form">
        <input
          type="text"
          placeholder="What's happening?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <img src={post.profilePic} alt={post.user} className="profile-pic" />
            <div className="post-content">
              <div className="profile-info">
                <h3>{post.user}</h3>
                <span className="job-title">{post.jobTitle}</span>
                {post.verified && <span className="verified">&#x2714;</span>}
              </div>
              <p>{post.content}</p>
              {post.chart && <img src={post.chart} alt="Market Chart" className="chart" />}
              <span className="timestamp">{new Date(post.timestamp).toLocaleString()}</span>
              <div className="post-actions">
                <button className="action-button"><i className="fas fa-comment"></i></button>
                <button className="action-button"><i className="fas fa-share"></i></button>
                <button className="action-button"><i className="fas fa-thumbs-up"></i></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
