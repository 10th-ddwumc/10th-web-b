// src/pages/MyPage.tsx
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyInfo, updateMyInfo } from "../api/auth";
import { uploadImage } from "../api/upload";
import { setTokens, getAccessToken, getRefreshToken } from "../utils/token";
import "../styles/MyPage.css";

type MyInfoResponse = {
  data: {
    id: number;
    name: string;
    email: string;
    bio?: string | null;
    avatar?: string | null;
  };
};

const MyPage = () => {
  const queryClient = useQueryClient();

  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { data, isLoading, isError } = useQuery<MyInfoResponse>({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  const user = data?.data;

  const displayName = isEditMode ? editName : user?.name ?? "";
  const displayBio = isEditMode ? editBio : user?.bio ?? "";
  const displayAvatar = isEditMode ? editAvatar : user?.avatar ?? "";

  const updateMutation = useMutation({
    mutationFn: async () => {
      let avatarUrl = editAvatar;

      if (file) {
        avatarUrl = await uploadImage(file);
      }

      return updateMyInfo({
        name: editName,
        bio: editBio,
        avatar: avatarUrl,
      });
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["myInfo"] });

      const previousMyInfo = queryClient.getQueryData<MyInfoResponse>([
        "myInfo",
      ]);

      queryClient.setQueryData<MyInfoResponse>(["myInfo"], (oldData) => {
        if (!oldData?.data) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            name: editName,
            bio: editBio,
            avatar: editAvatar,
          },
        };
      });

      setTokens(
        getAccessToken() ?? "",
        getRefreshToken() ?? undefined,
        editName,
        user?.id
      );

      return { previousMyInfo };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousMyInfo) {
        queryClient.setQueryData(["myInfo"], context.previousMyInfo);

        setTokens(
          getAccessToken() ?? "",
          getRefreshToken() ?? undefined,
          context.previousMyInfo.data.name,
          context.previousMyInfo.data.id
        );
      }

      alert("프로필 수정에 실패했습니다.");
    },

    onSuccess: (response: MyInfoResponse) => {
      const updatedUser = response.data;

      setTokens(
        getAccessToken() ?? "",
        getRefreshToken() ?? undefined,
        updatedUser?.name ?? editName,
        updatedUser?.id ?? user?.id
      );

      setIsEditMode(false);
      setFile(null);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    },
  });

  const handleEditStart = () => {
    if (!user) return;

    setEditName(user.name ?? "");
    setEditBio(user.bio ?? "");
    setEditAvatar(user.avatar ?? "");
    setFile(null);
    setIsEditMode(true);
  };

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
          {displayAvatar ? <img src={displayAvatar} alt="profile" /> : <div />}
        </div>

        <div className="profile-info">
          {isEditMode ? (
            <>
              <input
                className="profile-edit-input"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
              />
              <input
                className="profile-edit-input"
                value={editBio}
                onChange={(event) => setEditBio(event.target.value)}
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
                  setEditAvatar(URL.createObjectURL(selectedFile));
                }}
              />
            </>
          ) : (
            <>
              <h1>{displayName}</h1>
              <p>{displayBio || "안녕하세요. 저는 LP를 좋아합니다."}</p>
              <strong>{user.email}</strong>
            </>
          )}
        </div>

        {isEditMode ? (
          <button
            type="button"
            className="profile-setting"
            disabled={updateMutation.isPending}
            onClick={() => updateMutation.mutate()}
          >
            ✓
          </button>
        ) : (
          <button
            type="button"
            className="profile-setting"
            onClick={handleEditStart}
          >
            ⚙
          </button>
        )}
      </section>
    </main>
  );
};

export default MyPage;