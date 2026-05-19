// src/components/lp/LpEditorModal.tsx
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLp, updateLp } from "../../api/lp";
import { uploadImage } from "../../api/upload";
import type { Lp } from "../../types/lp";

type LpEditorModalProps = {
  mode: "create" | "edit";
  lp?: Lp;
  onClose: () => void;
};

const LpEditorModal = ({ mode, lp, onClose }: LpEditorModalProps) => {
  const queryClient = useQueryClient();

  const initialTags = useMemo(
    () => lp?.tags?.map((tag) => tag.name) ?? [],
    [lp]
  );

  const [title, setTitle] = useState(lp?.title ?? "");
  const [content, setContent] = useState(lp?.content ?? "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialTags);
  const [thumbnail, setThumbnail] = useState(lp?.thumbnail ?? "");
  const [preview, setPreview] = useState(lp?.thumbnail ?? "");
  const [file, setFile] = useState<File | null>(null);

  const isValid = title.trim().length > 0 && content.trim().length > 0;
  const isTagInputValid = tagInput.trim().length > 0;

  const mutation = useMutation({
    mutationFn: async () => {
      let thumbnailUrl = thumbnail;

      if (file) {
        thumbnailUrl = await uploadImage(file);
      }

      if (mode === "create") {
        return createLp({
          title,
          content,
          thumbnail: thumbnailUrl,
          tags,
          published: true,
        });
      }

      return updateLp({
        lpid: String(lp?.id),
        body: {
          title,
          content,
          thumbnail: thumbnailUrl,
          tags,
          published: true,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });

      if (lp?.id) {
        queryClient.invalidateQueries({ queryKey: ["lp", String(lp.id)] });
      }

      onClose();
    },
    onError: (error) => {
      console.error(error);
      alert(mode === "create" ? "LP 생성에 실패했습니다." : "LP 수정에 실패했습니다.");
    },
  });

  const handleAddTag = () => {
    const nextTag = tagInput.trim();

    if (!nextTag) return;
    if (tags.includes(nextTag)) {
      setTagInput("");
      return;
    }

    setTags((prev) => [...prev, nextTag]);
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  return (
    <div className="lp-modal-backdrop" onClick={onClose}>
      <section className="lp-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="lp-modal-close" onClick={onClose}>
          ×
        </button>

        <label
          className={`lp-image-picker ${preview ? "has-cover" : ""}`}
          aria-label="LP 커버 이미지 선택"
        >
          <div className="lp-default-disc" />

          {preview && (
            <img className="lp-cover-preview" src={preview} alt="LP 커버 미리보기" />
          )}

          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        <input
          className="lp-modal-input"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="LP Name"
        />

        <input
          className="lp-modal-input"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="LP Content"
        />

        <div className="lp-tag-row">
          <input
            className="lp-modal-input"
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="LP Tag"
          />
          <button
            type="button"
            className="lp-tag-add-button"
            disabled={!isTagInputValid}
            onClick={handleAddTag}
          >
            Add
          </button>
        </div>

        <div className="lp-tag-list">
          {tags.map((tag) => (
            <button
              type="button"
              key={tag}
              className="lp-tag-chip"
              onClick={() => handleRemoveTag(tag)}
            >
              {tag} ×
            </button>
          ))}
        </div>

        <button
          type="button"
          className="lp-submit-button"
          disabled={!isValid || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending
            ? "처리 중..."
            : mode === "create"
              ? "Add LP"
              : "Edit LP"}
        </button>
      </section>
    </div>
  );
};

export default LpEditorModal;