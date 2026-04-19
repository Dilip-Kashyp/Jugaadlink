const getItem = (key: string) => {
    // Check cookies first (most reliable for server-side)
    const name = key + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    // Fallback to sessionStorage
    return sessionStorage.getItem(key);
}

const setItem = (key: string, value: string) => {
    // Set sessionStorage
    sessionStorage.setItem(key, value);
    
    // Set Cookie (Max-Age: 7 days)
    const expires = new Date();
    expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000));
    document.cookie = `${key}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

const removeItem = (key: string) => {
    sessionStorage.removeItem(key);
    // Clear Cookie
    document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

const clear = () => {
    sessionStorage.clear();
    // Clear common cookies
    document.cookie = "access_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    document.cookie = "refresh_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
}

export { getItem, setItem, removeItem, clear };