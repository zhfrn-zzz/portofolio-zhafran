import React, { useState, useEffect, useRef } from 'react';
import { getDocs, addDoc, collection, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { MessageCircle, Send, UserCircle2 } from 'lucide-react';

const Komentar = () => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const commentsEndRef = useRef(null);
    const commentsContainerRef = useRef(null);

    useEffect(() => {
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
                await addDoc(collection(db, 'portfolio-comments'), {
                    content: newComment,
                    userName: userName,
                    createdAt: serverTimestamp(),
                });
                // Clear input fields
                setNewComment('');
                setUserName('');

                // Scroll ke bawah setelah komentar ditambahkan
        /*         setTimeout(scrollToBottom, 100); */
            } catch (error) {
                console.error('Error adding document: ', error);
            }
        }
    };

    // Fungsi format tanggal yang sama
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="w-full bg-white/5 backdrop-blur-lg rounded-2xl p-6 h-[650px] flex flex-col   ">
            {/* Header */}
            <div className="flex items-center mb-4">
                <MessageCircle className="w-8 h-8 mr-3 text-[#6366f1]" />
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                    Community Comments
                </h3>
            </div>

            {/* Comments Area - Custom Scrollbar */}
            <div 
                ref={commentsContainerRef}
                className="flex-grow overflow-y-auto space-y-4 mb-4 pr-2"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(99, 102, 241, 0.5) rgba(255,255,255,0.1)'
                }}
            >
                {comments.length === 0 ? (
                    <div className="text-gray-400 text-center py-4">
                        No comments yet. Be the first to comment!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div 
                            key={comment.id} 
                            className="bg-white/10 p-4 rounded-lg shadow-md flex items-start space-x-3"
                        >
                            <UserCircle2 className="w-8 h-8 text-[#6366f1] flex-shrink-0 mt-1" />
                            <div className="flex-grow">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-[#6366f1] truncate ">
                                        {comment.userName}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {formatDate(comment.createdAt)}
                                    </span>
                                </div>
                                <p className="text-gray-300 break-words">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                {/* Ref untuk scroll ke bawah */}
                <div ref={commentsEndRef} />
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

            {/* Custom CSS for Scrollbar */}
            <style jsx global>{`
                .overflow-y-auto::-webkit-scrollbar {
                    width: 8px;
                }
                .overflow-y-auto::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: rgba(99, 102, 241, 0.5);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default Komentar;