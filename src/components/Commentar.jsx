import React, { useState, useEffect } from 'react';
import { getDocs, addDoc, collection, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { MessageCircle, Send } from 'lucide-react';

const Komentar = () => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Fetch comments from Firestore in real-time
        const commentsRef = collection(db, 'portfolio-comments');
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
        if (newComment.trim() && userName.trim()) {
            try {
                // Add new comment to Firestore
                await addDoc(collection(db, 'portfolio-comments'), {
                    content: newComment,
                    userName: userName,
                    createdAt: serverTimestamp(),
                });
                setNewComment('');
            } catch (error) {
                console.error('Error adding document: ', error);
            }
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 h-full flex flex-col">
            <div className="flex items-center mb-6">
                <MessageCircle className="w-8 h-8 mr-3 text-[#6366f1]" />
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                    Community Comments
                </h3>
            </div>

            {/* Comments Display Area */}
            <div className="flex-grow overflow-y-auto space-y-4 mb-6 pr-2">
                {comments.length === 0 ? (
                    <div className="text-gray-400 text-center py-4">
                        No comments yet. Be the first to comment!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div 
                            key={comment.id} 
                            className="bg-white/10 p-4 rounded-lg shadow-md"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-[#6366f1]">
                                    {comment.userName}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {comment.createdAt?.toDate()?.toLocaleString()}
                                </span>
                            </div>
                            <p className="text-gray-300">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Comment Input Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-4">
                <input 
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full p-3 bg-white/10 rounded-lg border border-white/20 
                        text-white placeholder-gray-500 focus:outline-none 
                        focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/50"
                    required
                />
                <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full p-3 bg-white/10 rounded-lg border border-white/20 
                        text-white placeholder-gray-500 focus:outline-none 
                        focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/50 
                        h-24 resize-none"
                    required
                />
                <button 
                    type="submit"
                    className="w-full p-3 bg-gradient-to-r from-[#6366f1] to-[#a855f7] 
                        text-white rounded-lg hover:scale-[1.02] 
                        transition-transform duration-300 flex items-center 
                        justify-center gap-2 group"
                >
                    <Send className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Post Comment
                </button>
            </form>
        </div>
    );
};

export default Komentar;