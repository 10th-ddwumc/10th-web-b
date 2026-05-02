import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";

const MyPage = () => {
    const {logout} = useAuth();
    const [data, setdata] = useState<ResponseMyInfoDto | null>(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getMyInfo();
                setdata(response);
            } catch (error) {
                console.error("내 정보 불러오기 실패:", error);
            }
        }
        getData();
    }, []);

    if (!data) return <div>로딩 중...</div>;

    const handleLogout = async() => {
        await logout();
    };

    return (

        <div>
            <h1>내 정보</h1>
            <p>{data?.data.name}</p>
            <p>{data?.data.email}</p>
            <img src={data?.data.avatar as string} alt={"구글 로고"}/>
            <button className="cursor-pointer bg-blue-300 rounded-sm p-5 hover-scale-90" onClick={handleLogout}>로그아웃</button>
        </div>
    )
}

export default MyPage;