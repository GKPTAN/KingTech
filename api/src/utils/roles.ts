export enum ROLES {
    ADMIN = 'admin',
    USER = 'user'
};

export type VALID_ROLES = ROLES;

export const isValidRole = (role: string): role is ROLES => {
    return  Object.values(ROLES).includes(role as ROLES);
}