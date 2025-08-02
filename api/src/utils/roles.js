export const ROLES = {
    ADMIN: 'admin',
    USER: 'user'
};

export const VALID_ROLES = [ROLES.ADMIN, ROLES.USER];

export const isValidRole = (role) => {
    return VALID_ROLES.includes(role);
}