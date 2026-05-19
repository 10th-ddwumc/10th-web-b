import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCat, patchCat } from "../apis/cat";
import { uploadImage } from "../apis/upload";
import { X, Plus } from "lucide-react";
import type { Cat } from "../types/cat";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Cat | null;
}

const PostModal = ({ isOpen, onClose, initialData }: PostModalProps) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setTags(initialData.tags.map(t => t.name));
      setPreviewUrl(initialData.thumbnail);
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const mutation = useMutation({
    mutationFn: async () => {
      let imageUrl = previewUrl || "";
      if (image) {
        imageUrl = await uploadImage(image);
      }

      if (initialData) {
        return patchCat(initialData.id.toString(), {
          title,
          content,
          thumbnail: imageUrl,
          tags,
          published: true, // 기본적으로 true로 전송
        });
      }

      return postCat({
        title,
        content,
        thumbnail: imageUrl,
        tags,
        published: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cats"] });
      if (initialData) {
        queryClient.invalidateQueries({ queryKey: ["cat", initialData.id.toString()] });
      }
      onClose();
      resetForm();
    },
    onError: (error) => {
      console.error("Upload error:", error);
      alert("업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setTagInput("");
    setImage(null);
    setPreviewUrl(null);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-black mb-8">
          {initialData ? "포스트 수정" : "새 포스트 작성"}
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              placeholder="내용을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">태그</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                placeholder="태그 입력"
              />
              <button
                onClick={handleAddTag}
                className="px-6 py-3 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span 
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  #{tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-blue-200 transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">사진</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all overflow-hidden"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                    <Plus size={24} />
                  </div>
                  <span className="text-sm font-bold text-gray-400 tracking-tight">이미지 업로드</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || !title || !content || (!image && !previewUrl) || tags.length === 0}
          className="w-full mt-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-300 disabled:shadow-none transition-all transform active:scale-95"
        >
          {mutation.isPending ? "저장 중..." : (initialData ? "Update Post" : "Publish Post")}
        </button>
      </div>
    </div>
  );
};

export default PostModal;

