import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { api } from "../services/api";


export type UserData = {
    id: string,
    name: string,
    avatarUrl: string,
    token: string,
}

type UserContextProps = {
    getUserInfo: (githubCode: string) => Promise<void>;
    userData: UserData;
    logout: () => void;
}

type UserProviderProps = {
    children: ReactNode;
}

export const localStorageKey = `${import.meta.env.VITE_LOCALSTORAGE_KEY}:userData`;

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export function UserProvider({ children }: UserProviderProps) {
    const [userData, setUserData] = useState<UserData>({} as UserData);


    function putUserData(data: UserData) {
        setUserData(data);

        localStorage.setItem(localStorageKey, JSON.stringify(data));
    }

    async function getUserInfo(githubCode: string) {
        const { data } = await api.get<UserData>('/auth/callback', {
            params: {
                code: githubCode
            }
        });
        putUserData(data);
    }

    async function loadUserdata() {
        const localData = localStorage.getItem(localStorageKey);
        if (localData) {
            setUserData(JSON.parse(localData) as UserData);
        }
    }

    async function logout() {
        setUserData({} as UserData);
        localStorage.removeItem(localStorageKey);
    }

    useEffect(() => {
        loadUserdata();
    }, [])


    return (
        <UserContext.Provider value={{ userData, getUserInfo, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserContext");
    }
    return context;
}