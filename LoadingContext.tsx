// src/context/LoadingContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
    loading: boolean;
    setLoading: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
    loading: false,
    setLoading: () => {},
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(false);

    console.log("[LoadingContext] loading state:", loading);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
