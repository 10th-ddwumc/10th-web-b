import { useEffect, useState } from "react";

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export function useAuth() {
    const [status, setStatus] = useState<AuthStatus>('loading');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if(token){
            setStatus('authenticated');
        }
        else {
            setStatus('unauthenticated');
        }
    }, []);

    return {status};
}