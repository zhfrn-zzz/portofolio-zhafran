import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { MessageCircle, UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X, Pin } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from '../supabase';
import { useI18n } from './I18nProvider';
import TransText from './TransText';


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
                                <span className="text-xs font-medium uppercase tracking-wide">
                                    <TransText k="comment.pinnedLabel" fallback="Komentar Tersemat" />
                                </span>
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
                                                            <TransText k="comment.adminBadge" fallback="Admin" />
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
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const { t } = useI18n();
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    // Mobile detection with proper fallback
    useEffect(() => {
        const checkMobile = () => {
            if (typeof window !== 'undefined') {
                setIsMobileDevice(window.innerWidth < 768);
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert(t('comment.errors.fileTooLarge', 'Ukuran file harus kurang dari 5MB. Silakan pilih gambar yang lebih kecil.'));
                // Reset the input
                if (e.target) e.target.value = '';
                return;
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                alert(t('comment.errors.invalidImage', 'Silakan pilih file gambar yang valid.'));
                if (e.target) e.target.value = '';
                return;
            }
            
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }, [t]);

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
            <div className="space-y-2" 
                 data-aos={isMobileDevice ? "fade-right" : "fade-up"} 
                 data-aos-duration={isMobileDevice ? "500" : "1000"}
                 data-aos-delay={isMobileDevice ? "0" : "100"}>
                <label className="block text-sm font-medium dark:text-white text-lighttext">
                    {t('comment.nameLabel', 'Nama')} <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    maxLength={15}
                    placeholder={t('comment.namePlaceholder', 'Masukkan nama Anda')}
                    className="w-full p-3 rounded-xl dark:bg-white/5 bg-white dark:border-white/10 border-lightaccent/30 dark:text-white text-lighttext placeholder-gray-500 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
                    required
                />
            </div>

            <div className="space-y-2" 
                 data-aos={isMobileDevice ? "fade-left" : "fade-up"} 
                 data-aos-duration={isMobileDevice ? "500" : "1200"}
                 data-aos-delay={isMobileDevice ? "100" : "200"}>
                <label className="block text-sm font-medium dark:text-white text-lighttext">
                    {t('comment.messageLabel', 'Pesan')} <span className="text-red-400">*</span>
                </label>
                <textarea
                    ref={textareaRef}
                    value={newComment}
                    maxLength={200}
                    onChange={handleTextareaChange}
                    placeholder={t('comment.placeholder', 'Tulis pesan Anda di sini...')}
                    className="w-full p-4 rounded-xl dark:bg-white/5 bg-white dark:border-white/10 border-lightaccent/30 dark:text-white text-lighttext placeholder-gray-500 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all resize-none min-h-[120px]"
                    required
                />
            </div>

            <div className="space-y-2" 
                 data-aos={isMobileDevice ? "fade-right" : "fade-up"} 
                 data-aos-duration={isMobileDevice ? "500" : "1400"}
                 data-aos-delay={isMobileDevice ? "200" : "300"}>
                <label className="block text-sm font-medium dark:text-white text-lighttext">
                    {t('comment.profilePhotoOptional', 'Foto Profil (opsional)')}
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
                                <span>{t('comment.removePhoto', 'Hapus Foto')}</span>
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
                                <span>{t('comment.choosePhoto', 'Pilih Foto Profil')}</span>
                            </button>
                            <p className="text-center dark:text-gray-400 text-lighttext/80 text-sm mt-2">
                                {t('comment.fileMax', 'Maksimal Ukuran File: 5MB')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                data-aos={isMobileDevice ? "zoom-in" : "fade-up"} 
                data-aos-duration={isMobileDevice ? "400" : "1000"}
                data-aos-delay={isMobileDevice ? "300" : "400"}
                className="relative w-full h-12 dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] bg-lightaccent rounded-xl font-medium text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center justify-center gap-2">
            {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('comment.sending', 'Mengirim...')}</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                <span>{t('comment.send', 'Kirim Komentar')}</span>
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
    const [isLoading, setIsLoading] = useState(true);
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const { t, lang } = useI18n();

    // Mobile detection with proper fallback
    useEffect(() => {
        const checkMobile = () => {
            if (typeof window !== 'undefined') {
                setIsMobileDevice(window.innerWidth < 768);
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // Initialize AOS with mobile-optimized settings
        AOS.init({
            once: false,
            duration: isMobileDevice ? 400 : 1000,
            mirror: true,
            offset: isMobileDevice ? 50 : 100,
            delay: 0,
            disable: false, // Never disable AOS
            easing: 'ease-in-out',
            anchorPlacement: 'top-bottom'
        });

        // Refresh AOS on mobile to ensure proper detection
        if (isMobileDevice) {
            setTimeout(() => {
                AOS.refresh();
            }, 100);
        }
    }, [isMobileDevice]);

    // Fetch pinned comment with better error handling
    useEffect(() => {
        const fetchPinnedComment = async () => {
            try {
                setIsLoading(true);
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

    // Fetch regular comments with improved mobile support
    useEffect(() => {
        let isMounted = true;
        
        const fetchComments = async () => {
            try {
                const { data, error } = await supabase
                    .from('portfolio_comments')
                    .select('*')
                    .eq('is_pinned', false)
                    .order('created_at', { ascending: false });
                
                if (error) {
                    console.error('Error fetching comments:', error);
                    if (isMounted) setError('Failed to load comments');
                    return;
                }
                
                if (isMounted) {
                    setComments(data || []);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Error in fetchComments:', err);
                if (isMounted) {
                    setError('Failed to load comments');
                    setIsLoading(false);
                }
            }
        };

        fetchComments();

        // Set up real-time subscription with better error handling
        const subscription = supabase
            .channel('portfolio_comments_channel')
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'portfolio_comments',
                    filter: 'is_pinned=eq.false'
                }, 
                (payload) => {
                    console.log('Real-time update received:', payload);
                    if (isMounted) {
                        fetchComments(); // Refresh comments when changes occur
                        
                        // Refresh AOS after content update, especially important for mobile
                        setTimeout(() => {
                            AOS.refresh();
                        }, 100);
                    }
                }
            )
            .subscribe((status) => {
                console.log('Subscription status:', status);
            });

        return () => {
            isMounted = false;
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

            // Force refresh AOS after successful comment submit (important for mobile)
            setTimeout(() => {
                AOS.refresh();
            }, 200);
            
        } catch (error) {
            setError(t('comment.errors.postFailed', 'Gagal mengirim komentar. Silakan coba lagi.'));
            console.error('Error adding comment: ', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [uploadImage, t]);

    const formatDate = useCallback((timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return t('comment.time.justNow', 'Baru saja');
        if (diffMinutes < 60) return `${diffMinutes} ${t('comment.time.minutes', 'menit yang lalu')}`;
        if (diffHours < 24) return `${diffHours} ${t('comment.time.hours', 'jam yang lalu')}`;
        if (diffDays < 7) return `${diffDays} ${t('comment.time.days', 'hari yang lalu')}`;

        const locale = lang === 'id' ? 'id-ID' : 'en-US';
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }, [t, lang]);

    // Calculate total comments (pinned + regular)
    const totalComments = comments.length + (pinnedComment ? 1 : 0);

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full rounded-2xl backdrop-blur-xl shadow-xl dark:bg-gradient-to-b dark:from-white/10 dark:to-white/5 bg-gradient-to-b from-[var(--accent)]/10 to-[var(--muted)]/5">
                <div className="p-6 border-b dark:border-white/10 border-[var(--accent)]/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl dark:bg-indigo-500/20 bg-[var(--accent)]/20">
                            <MessageCircle className="w-6 h-6 dark:text-indigo-400 text-[var(--accent)]" />
                        </div>
                        <h3 className="text-xl font-semibold text-black dark:text-white">
                            <TransText k="comment.title" fallback="Komentar" />
                        </h3>
                    </div>
                </div>
                <div className="p-6 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin dark:text-indigo-400 text-[var(--accent)]" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full rounded-2xl backdrop-blur-xl shadow-xl dark:bg-gradient-to-b dark:from-white/10 dark:to-white/5 bg-gradient-to-b from-[var(--accent)]/10 to-[var(--muted)]/5" 
             data-aos={isMobileDevice ? "fade-up" : "fade-up"} 
             data-aos-duration={isMobileDevice ? "600" : "1000"}
             data-aos-offset={isMobileDevice ? "50" : "100"}>
            <div className="p-6 border-b dark:border-white/10 border-[var(--accent)]/30" 
                 data-aos={isMobileDevice ? "fade-down" : "fade-down"} 
                 data-aos-duration={isMobileDevice ? "500" : "800"}>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl dark:bg-indigo-500/20 bg-[var(--accent)]/20">
                        <MessageCircle className="w-6 h-6 dark:text-indigo-400 text-[var(--accent)]" />
                    </div>
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                        <TransText k="comment.title" fallback="Komentar" /> <span className="dark:text-indigo-400 text-[var(--accent)]">({totalComments})</span>
                    </h3>
                </div>
            </div>
            <div className="p-6 space-y-6">
                {error && (
                    <div className="flex items-center gap-2 p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl" 
                         data-aos="fade-in" 
                         data-aos-duration={isMobileDevice ? "400" : "600"}>
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                
                <div>
                    <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} error={error} />
                </div>

                <div className="space-y-4 h-[328px] overflow-y-auto overflow-x-hidden custom-scrollbar pt-1 pr-1" 
                     data-aos={isMobileDevice ? "fade-up" : "fade-up"} 
                     data-aos-delay={isMobileDevice ? "100" : "200"}
                     data-aos-duration={isMobileDevice ? "500" : "800"}>
                    {/* Pinned Comment */}
                    {pinnedComment && (
                        <div data-aos={isMobileDevice ? "fade-right" : "fade-down"} 
                             data-aos-duration={isMobileDevice ? "500" : "800"}
                             data-aos-delay={isMobileDevice ? "0" : "100"}>
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
                        <div className="text-center py-8" 
                             data-aos="fade-in" 
                             data-aos-duration={isMobileDevice ? "500" : "800"}>
                            <UserCircle2 className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-50" />
                            <p className="text-gray-400">
                                <TransText k="comment.empty" fallback="Belum ada komentar. Mulai percakapan!" />
                            </p>
                        </div>
                    ) : (
                        comments.map((comment, index) => (
                            <div key={comment.id}
                                 data-aos={isMobileDevice ? "fade-left" : "fade-up"} 
                                 data-aos-duration={isMobileDevice ? "400" : "600"}
                                 data-aos-delay={isMobileDevice ? (index * 50) : (index * 100)}>
                                <Comment 
                                    comment={comment} 
                                    formatDate={formatDate}
                                    index={index + (pinnedComment ? 1 : 0)}
                                    isPinned={false}
                                />
                            </div>
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