import React, { useState, useEffect } from 'react';
import { getDocs, addDoc, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const PortfolioCommentSystem = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Fetch comments from Firestore in real-time
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    });

    return unsubscribe;
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        // Add new comment to Firestore
        await addDoc(collection(db, 'comments'), {
          content: newComment,
          createdAt: new Date(),
        });
        setNewComment('');
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    }
  };

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg max-w-6xl mx-auto relative z-10">
      <h2 className="text-2xl font-bold mb-8">Comments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors duration-300 cursor-pointer relative z-10 flex flex-col justify-between"
          >
            <p className="mb-4">{comment.content}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Posted on {comment.createdAt.toDate().toLocaleString()}
              </p>
              <div className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg relative z-10 mt-8">
        <h2 className="text-2xl font-bold mb-4">Add a Comment</h2>  
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="bg-gray-700 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 mt-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PortfolioCommentSystem;