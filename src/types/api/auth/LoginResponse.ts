export interface LoginResponse {
    user: User,
    token: string,
}

export interface User {
    id: number,
    username: string,
    email: string,
    createdAt: string,
    updatedAt: string,
}