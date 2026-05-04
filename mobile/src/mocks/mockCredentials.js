/**
 * Mock credentials for testing without backend.
 * When the real API returns an error, these credentials are tried as fallback.
 */

export const MOCK_USERS = {
    student: {
        email: 'matheus@gmail.com',
        password: 'senha123',
        response: {
            token: 'mock-token-student-abc123',
            id: 1,
            userId: 1,
            role: 'STUDENT',
            email: 'matheus@gmail.com',
            username: 'Matheus Alves',
            name: 'Matheus Alves',
        },
    },
    teacher: {
        email: 'carlos.prof@gmail.com',
        password: 'senha123',
        response: {
            token: 'mock-token-teacher-def456',
            id: 2,
            userId: 2,
            role: 'TEACHER',
            email: 'carlos.prof@gmail.com',
            username: 'Prof. Carlos Lima',
            name: 'Prof. Carlos Lima',
        },
    },
    admin: {
        email: 'admin@exemplo.com',
        password: 'password',
        response: {
            token: 'mock-token-admin-ghi789',
            id: 3,
            userId: 3,
            role: 'ADMIN',
            email: 'admin@exemplo.com',
            username: 'Admin Studi',
            name: 'Admin Studi',
        },
    },
};

/**
 * Try to authenticate with mock credentials.
 * Returns the mock user response if credentials match, otherwise null.
 */
export function tryMockLogin(email, password) {
    const normalizedEmail = email?.trim().toLowerCase();
    for (const key of Object.keys(MOCK_USERS)) {
        const user = MOCK_USERS[key];
        if (user.email === normalizedEmail && user.password === password) {
            return { ...user.response };
        }
    }
    return null;
}
