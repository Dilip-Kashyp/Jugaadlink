export const LOCAL_STORAGE_KEY = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    USER: "user",
    SESSION_TOKEN: "session_token",
}

export const API_ENDPOINTS = {
    SHORTEN: "/url/shorten",
    REGISTER: "/user/register",
    LOGIN: "/user/login",
    GET_USER: "/user/get-user",
    HISTORY: "/url/history",
    PING: "/test/ping",
    REDIRECT: "/r/",
    DELETE: "/url",
    ANALYTICS: "/url/analytics",
    ANALYTICS_INTERVAL_ALL: "/url/analytics?interval=all",
    PREVIEW: "/url/preview",
    VERIFY_PASSWORD: "/verify-password",
    UPDATE: "/url",
}

export const PAGE_ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    SIGNUP: "/signup",
    DASHBOARD: "/dashboard",
    PASSWORD: "/password",
    LINK_DISABLED: "/link-disabled",
}

export const PIE_COLORS = ['var(--primary)', 'var(--success)', 'var(--chart-line)', 'var(--hover-primary)'];

export const DASHBOARD_TABLE_COLUMNS  = [
    {
      title: "Original URL",
      dataIndex: "original_url",
      key: "original_url",
    },
    {
      title: "Short URL",
      dataIndex: "short_url",
      key: "short_url",
    },
    {
      title: "QR Code",
      dataIndex: "short_url",
      key: "short_url",
    },
    {
      title: "Status",
      dataIndex: "short_url",
      key: "short_url",
    },
    {
      title: "Clicks",
      dataIndex: "clicks",
      key: "clicks",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
  ];