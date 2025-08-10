import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { MessageCircle, UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X, Pin } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from '../supabase';


const Comment = memo(({ comment, formatDate, index, isPinned = false }) => (
    <div 
        className={`px-4 pt-4 pb-2 rounded-xl border transition-all group hover:shadow-lg hover:-translate-y-0.5 ${
            isPinned 
                ? 'dark:bg-gradient-to-r dark:from-indigo-500/10 dark:to-purple-500/10 bg-gradient-to-r from-lightaccent/15 to-lightmuted/15 dark:border-indigo-500/30 border-lightaccent/30 hover:dark:from-indigo-500/15 hover:dark:to-purple-500/15 hover:from-lightaccent/20 hover:to-lightmuted/20' 
                : 'dark:bg-white/5 bg-lightaccent/10 dark:border-white/10 border-lightaccent/30 dark:hover:bg-white/10 hover:bg-lightaccent/15'
        }`}
    >
        {isPinned && (
            <div className="flex items-center gap-2 mb-3 dark:text-indigo-400 text-[var(--accent)]">
                <Pin className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Pinned Comment</span>
            </div>
        )}
        <div className="flex items-start gap-3">
            {comment.profile_image ? (
                <img
                    src={comment.profile_image}
                    alt={`${comment.user_name}'s profile`}
                    className={`w-10 h-10 rounded-full object-cover border-2 flex-shrink-0  ${
                        isPinned ? 'dark:border-indigo-500/50 border-[var(--accent)]/50' : 'dark:border-indigo-500/30 border-[var(--accent)]/30'
                    }`}
                    loading="lazy"
                />
            ) : (
                <div className={`p-2 rounded-full transition-colors ${
                    isPinned ? 'dark:bg-indigo-500/30 dark:text-indigo-400 bg-[var(--accent)]/30 text-[var(--accent)]' : 'dark:bg-indigo-500/20 dark:text-indigo-400 bg-[var(--accent)]/20 text-[var(--accent)]'
                }`}>
                    <UserCircle2 className="w-5 h-5" />
                </div>
            )}
            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                        <h4 className={`font-medium truncate ${
                                    isPinned ? 'dark:text-indigo-200 text-lighttext' : 'dark:text-white text-lighttext'
                                }`}>
                            {comment.user_name}
                        </h4>
                        {isPinned && (
                            <span className="px-2 py-0.5 text-xs dark:bg-indigo-500/20 dark:text-indigo-300 bg-[var(--accent)]/20 text-[var(--accent)] rounded-full">
                                Admin
                            </span>
                        )}
                    </div>
                    <span className="text-xs dark:text-gray-400 text-lighttext/70 whitespace-nowrap">
                        {formatDate(comment.created_at)}
                    </span>
                </div>
                <p className="dark:text-gray-300 text-lighttext/80 text-sm break-words leading-relaxed relative bottom-2">
                    {comment.content}
                </p>
            </div>
        </div>
    </div>
));

const CommentForm = memo(({ onSubmit, isSubmitting, error }) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB. Please choose a smaller image.');
                // Reset the input
                if (e.target) e.target.value = '';
                return;
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                if (e.target) e.target.value = '';
                return;
            }
            
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }, []);

    const handleTextareaChange = useCallback((e) => {
        setNewComment(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!newComment.trim() || !userName.trim()) return;
        
        onSubmit({ newComment, userName, imageFile });
        setNewComment('');
        setUserName('');
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [newComment, userName, imageFile, onSubmit]);

    return (
    <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000">
        <label className="block text-sm font-medium dark:text-white text-lighttext">
                    Name <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                     maxLength={15}
                    placeholder="Enter your name"
                    className="w-full p-3 rounded-xl dark:bg-white/5 bg-white dark:border-white/10 border-lightaccent/30 dark:text-white text-lighttext placeholder-gray-500 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200">
                <label className="block text-sm font-medium dark:text-white text-lighttext">
                    Message <span className="text-red-400">*</span>
                </label>
                <textarea
                    ref={textareaRef}
                    value={newComment}
                     maxLength={200}

                    onChange={handleTextareaChange}
                    placeholder="Write your message here..."
                    className="w-full p-4 rounded-xl dark:bg-white/5 bg-white dark:border-white/10 border-lightaccent/30 dark:text-white text-lighttext placeholder-gray-500 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all resize-none min-h-[120px]"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1400">
                <label className="block text-sm font-medium dark:text-white text-lighttext">
                    Profile Photo <span className="dark:text-gray-400 text-lighttext/70">(optional)</span>
                </label>
                <div className="flex items-center gap-4 p-4 dark:bg-white/5 bg-lightaccent/10 dark:border-white/10 border-lightaccent/30 rounded-xl">
                    {imagePreview ? (
                        <div className="flex items-center gap-4">
                            <img
                                src={imagePreview}
                                alt="Profile preview"
                                className="w-16 h-16 rounded-full object-cover border-2 dark:border-indigo-500/50 border-[var(--accent)]/50"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setImageFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all group"
                            >
                                <X className="w-4 h-4" />
                                <span>Remove Photo</span>
                            </button>
                        </div>
                    ) : (
                        <div className="w-full">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all border border-dashed group dark:bg-indigo-500/20 dark:text-indigo-400 dark:hover:bg-indigo-500/30 dark:border-indigo-500/50 dark:hover:border-indigo-500 bg-[var(--accent)]/20 text-[var(--accent)] hover:bg-[var(--accent)]/30 border-[var(--accent)]/50 hover:border-[var(--accent)]"
                            >
                                <ImagePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Choose Profile Photo</span>
                            </button>
                            <p className="text-center dark:text-gray-400 text-lighttext/80 text-sm mt-2">
                                Max file size: 5MB
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                data-aos="fade-up" data-aos-duration="1000"
                className="relative w-full h-12 dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] bg-lightaccent rounded-xl font-medium text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Posting...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Post Comment</span>
                        </>
                    )}
                </div>
            </button>
        </form>
    );
});

const Komentar = () => {
    const [comments, setComments] = useState([]);
    const [pinnedComment, setPinnedComment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialize AOS
        AOS.init({
            once: false,
            duration: 1000,
        });
    }, []);

    // Fetch pinned comment
    useEffect(() => {
        const fetchPinnedComment = async () => {
            try {
                const { data, error } = await supabase
                    .from('portfolio_comments')
                    .select('*')
                    .eq('is_pinned', true)
                    .single();
                
                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching pinned comment:', error);
                    return;
                }
                
                if (data) {
                    setPinnedComment(data);
                }
            } catch (error) {
                console.error('Error fetching pinned comment:', error);
            }
        };

        fetchPinnedComment();
    }, []);

    // Fetch regular comments (excluding pinned) and set up real-time subscription
    useEffect(() => {
        const fetchComments = async () => {
            const { data, error } = await supabase
                .from('portfolio_comments')
                .select('*')
                .eq('is_pinned', false)
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error fetching comments:', error);
                return;
            }
            
            setComments(data || []);
        };

        fetchComments();

        // Set up real-time subscription
        const subscription = supabase
            .channel('portfolio_comments')
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'portfolio_comments',
                    filter: 'is_pinned=eq.false'
                }, 
                () => {
                    fetchComments(); // Refresh comments when changes occur
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const uploadImage = useCallback(async (imageFile) => {
        if (!imageFile) return null;
        
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('profile-images')
            .upload(filePath, imageFile);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('profile-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }, []);

    const handleCommentSubmit = useCallback(async ({ newComment, userName, imageFile }) => {
        setError('');
        setIsSubmitting(true);
        
        try {
            const profileImageUrl = await uploadImage(imageFile);
            
            const { error } = await supabase
                .from('portfolio_comments')
                .insert([
                    {
                        content: newComment,
                        user_name: userName,
                        profile_image: profileImageUrl,
                        is_pinned: false,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) {
                throw error;
            }
        } catch (error) {
            setError('Failed to post comment. Please try again.');
            console.error('Error adding comment: ', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [uploadImage]);

    const formatDate = useCallback((timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }, []);

    // Calculate total comments (pinned + regular)
    const totalComments = comments.length + (pinnedComment ? 1 : 0);

    return (
        <div className="w-full rounded-2xl backdrop-blur-xl shadow-xl dark:bg-gradient-to-b dark:from-white/10 dark:to-white/5 bg-gradient-to-b from-[var(--accent)]/10 to-[var(--muted)]/5" data-aos="fade-up" data-aos-duration="1000">
            <div className="p-6 border-b dark:border-white/10 border-[var(--accent)]/30" data-aos="fade-down" data-aos-duration="800">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl dark:bg-indigo-500/20 bg-[var(--accent)]/20">
                        <MessageCircle className="w-6 h-6 dark:text-indigo-400 text-[var(--accent)]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white dark:text-white">
                        Comments <span className="dark:text-indigo-400 text-[var(--accent)]">({totalComments})</span>
                    </h3>
                </div>
            </div>
            <div className="p-6 space-y-6">
                {error && (
                    <div className="flex items-center gap-2 p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl" data-aos="fade-in">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                
                <div>
                    <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} error={error} />
                </div>

                <div className="space-y-4 h-[328px] overflow-y-auto overflow-x-hidden custom-scrollbar pt-1 pr-1 " data-aos="fade-up" data-aos-delay="200">
                    {/* Pinned Comment */}
                    {pinnedComment && (
                        <div data-aos="fade-down" data-aos-duration="800">
                            <Comment 
                                comment={pinnedComment} 
                                formatDate={formatDate}
                                index={0}
                                isPinned={true}
                            />
                        </div>
                    )}
                    
                    {/* Regular Comments */}
                    {comments.length === 0 && !pinnedComment ? (
                        <div className="text-center py-8" data-aos="fade-in">
                            <UserCircle2 className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-50" />
                            <p className="text-gray-400">No comments yet. Start the conversation!</p>
                        </div>
                    ) : (
                        comments.map((comment, index) => (
                            <Comment 
                                key={comment.id} 
                                comment={comment} 
                                formatDate={formatDate}
                                index={index + (pinnedComment ? 1 : 0)}
                                isPinned={false}
                            />
                        ))
                    )}
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(99, 102, 241, 0.5);
                    border-radius: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(99, 102, 241, 0.7);
                }
            `}</style>
        </div>
    );
};

export default Komentar;