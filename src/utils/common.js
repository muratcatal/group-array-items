export const generateKey = (prefix) => {
    return `${prefix}${new Date().getTime()}`;
}