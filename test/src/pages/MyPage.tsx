// src/pages/MyPage.tsx
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyInfo, updateMyInfo } from "../api/auth";
import { uploadImage } from "../api/upload";
import { setTokens, getAccessToken, getRefreshToken } from "../utils/token";
import "../styles/Mypage.css"

const MyPage = () => {
  const queryClient = useQueryClient();

  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  const user = data?.data;

  useEffect(() => {
    if (!user) return;

    setName(user.name ?? "");
    setBio(user.bio ?? "");
    setAvatar(user.avatar ?? "");
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      let avatarUrl = avatar;

      if (file) {
        avatarUrl = await uploadImage(file);
      }

      return updateMyInfo({
        name,
        bio,
        avatar: avatarUrl,
      });
    },
    onSuccess: (response) => {
      const updatedUser = response.data;

      setTokens(
        getAccessToken() ?? "",
        getRefreshToken() ?? undefined,
        updatedUser?.name ?? name,
        updatedUser?.id
      );

      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      setIsEditMode(false);
    },
    onError: () => {
      alert("프로필 수정에 실패했습니다.");
    },
  });

  if (isLoading) {
    return <main className="mypage">불러오는 중...</main>;
  }

  if (isError || !user) {
    return <main className="mypage">마이페이지 정보를 불러오지 못했습니다.</main>;
  }

  return (
    <main className="mypage">
      <section className="profile-area">
        <div className="profile-image-large">
          {avatar ? <img src={avatar} alt="profile" /> : <div />}
        </div>

        <div className="profile-info">
          {isEditMode ? (
            <>
              <input
                className="profile-edit-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <input
                className="profile-edit-input"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Bio"
              />
              <p>{user.email}</p>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0];

                  if (!selectedFile) return;

                  setFile(selectedFile);
                  setAvatar(URL.createObjectURL(selectedFile));
                }}
              />
            </>
          ) : (
            <>
              <h1>{user.name}</h1>
              <p>{user.bio || "안녕하세요. 저는 LP를 좋아합니다."}</p>
              <strong>{user.email}</strong>
            </>
          )}
        </div>

        {isEditMode ? (
          <button
            type="button"
            className="profile-setting"
            onClick={() => updateMutation.mutate()}
          >
            ✓
          </button>
        ) : (
          <button
            type="button"
            className="profile-setting"
            onClick={() => setIsEditMode(true)}
          >
            ⚙
          </button>
        )}
      </section>
    </main>
  );
};

export default MyPage;