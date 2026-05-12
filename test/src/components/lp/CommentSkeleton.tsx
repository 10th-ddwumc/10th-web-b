// src/components/lp/CommentSkeleton.tsx
const CommentSkeleton = () => {
  return (
    <div className="comment-skeleton">
      <div className="comment-skeleton-avatar" />
      <div className="comment-skeleton-content">
        <div className="comment-skeleton-name" />
        <div className="comment-skeleton-text" />
      </div>
    </div>
  );
};

export default CommentSkeleton;