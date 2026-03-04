export interface User {
    id: number;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}