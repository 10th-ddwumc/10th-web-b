import { useState, useRef, useEffect } from "react";
import { getMyInfo, patchMyInfo } from "../apis/auth";
import { useAuth } from "../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadImage } from "../apis/upload";
import { Settings, Camera, User, Mail, FileText, Loader2 } from "lucide-react";

const MyPage = () => {
    const { logout } = useAuth();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: myInfo, isLoading } = useQuery({
        queryKey: ["myInfo"],
        queryFn: getMyInfo,
    });

    useEffect(() => {
        if (myInfo) {
            setName(myInfo.data.name);
            setBio(myInfo.data.bio || "");
            setPreviewUrl(myInfo.data.avatar);
        }
    }, [myInfo]);

    const updateMutation = useMutation({
        mutationFn: async () => {
            let imageUrl = myInfo?.data.avatar || "";
            if (avatar) {
                imageUrl = await uploadImage(avatar);
            }
            return patchMyInfo({
                name,
                bio,
                avatar: imageUrl,
            });
        },
        onMutate: async () => {
            // 1. 발송된 refetch를 취소하여 낙관적 업데이트를 덮어쓰지 않도록 함
            await queryClient.cancelQueries({ queryKey: ["myInfo"] });

            // 2. 이전 값 스냅샷 저장 (롤백용)
            const previousMyInfo = queryClient.getQueryData(["myInfo"]);

            // 3. 새 값으로 낙관적 업데이트 실시
            if (previousMyInfo) {
                queryClient.setQueryData(["myInfo"], (old: any) => ({
                    ...old,
                    data: {
                        ...old.data,
                        name,
                        bio,
                        avatar: previewUrl || old.data.avatar,
                    }
                }));
            }

            return { previousMyInfo };
        },
        onError: (err, variables, context) => {
            // 에러 발생 시 이전 스냅샷으로 롤백
            if (context?.previousMyInfo) {
                queryClient.setQueryData(["myInfo"], context.previousMyInfo);
            }
            alert("프로필 수정에 실패했습니다.");
        },
        onSettled: () => {
            // 성공하든 실패하든 서버와 동기화하기 위해 무효화
            queryClient.invalidateQueries({ queryKey: ["myInfo"] });
        },
        onSuccess: () => {
            setIsEditing(false);
            alert("프로필이 수정되었습니다.");
        },
    });

    if (isLoading) return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin text-blue-500" size={48} />
        </div>
    );

    const user = myInfo?.data;

    const handleStartEdit = () => {
        setName(user?.name || "");
        setBio(user?.bio || "");
        setPreviewUrl(user?.avatar || null);
        setIsEditing(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatar(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 md:p-10">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6 flex justify-between items-end">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-3xl border-4 border-white overflow-hidden bg-gray-100 shadow-lg">
                                {previewUrl || user?.avatar ? (
                                    <img 
                                        src={previewUrl || user?.avatar as string} 
                                        alt={user?.name} 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <User size={48} />
                                    </div>
                                )}
                            </div>
                            {isEditing && (
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition"
                                >
                                    <Camera size={18} />
                                </button>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleImageChange} 
                                className="hidden" 
                                accept="image/*" 
                            />
                        </div>

                        {!isEditing ? (
                            <button 
                                onClick={handleStartEdit}
                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition"
                            >
                                <Settings size={18} /> 설정
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                                >
                                    취소
                                </button>
                                <button 
                                    onClick={() => updateMutation.mutate()}
                                    disabled={updateMutation.isPending}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-gray-300"
                                >
                                    {updateMutation.isPending ? "저장 중..." : "저장"}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                <User size={14} /> 이름
                            </label>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            ) : (
                                <p className="text-xl font-bold text-gray-900">{user?.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                <Mail size={14} /> 이메일
                            </label>
                            <p className="text-gray-600">{user?.email}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                <FileText size={14} /> Bio
                            </label>
                            {isEditing ? (
                                <textarea 
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                    placeholder="자기소개를 입력하세요 (옵션)"
                                />
                            ) : (
                                <p className="text-gray-600">
                                    {user?.bio || "자기소개가 없습니다."}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t">
                        <button 
                            className="w-full py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition" 
                            onClick={() => logout()}
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyPage;