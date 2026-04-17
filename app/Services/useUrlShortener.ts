import { useMutation, useQuery } from "@tanstack/react-query";
import { shortenUrl, getUrlHistory, deleteUrl, getUrlAnalytics, getLinkPreview, pingServer, toggleUrl, UrlHistoryResponse, ShortenResult } from "./urlService";

type url = {
  original_url: string;
  expires_at?: string;
  password?: string;
  max_clicks?: number;
  tags?: string;
  category?: string;
  comment?: string;
  custom_domain?: string;
}

export const useUrlShortener = ({ mutationConfig }: { mutationConfig?: any } = {}) => {
  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    onError: (...args) => {
      onError?.(...args);
    },
    ...restConfig,
    mutationFn: (data: { data: url }) => shortenUrl(data.data),
  });
};

export const useLinkPreview = ({ mutationConfig }: { mutationConfig?: any } = {}) => {
  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation<any, Error, string>({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    onError: (...args) => {
      onError?.(...args);
    },
    ...restConfig,
    mutationFn: (url: string) => getLinkPreview(url),
  });
};

export const useUrlHistory = ({ queryConfig }: { queryConfig?: any } = {}) => {
  return useQuery<UrlHistoryResponse, Error>({
    queryKey: ['urlHistory'],
    queryFn: getUrlHistory,
    ...queryConfig,
  });
};


export const useDeleteUrl = ({ mutationConfig }: { mutationConfig?: any } = {}) => {
  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation<any, Error, string>({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    onError: (...args) => {
      onError?.(...args);
    },
    ...restConfig,
    mutationFn: deleteUrl,
  });
};

export const useUrlAnalytics = ({ mutationConfig }: { mutationConfig?: any } = {}) => {
  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation<any, Error, string>({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    onError: (...args) => {
      onError?.(...args);
    },
    ...restConfig,
    mutationFn: getUrlAnalytics,
  });
};

export const usePingServer = ({ queryConfig }: { queryConfig?: any } = {}) => {
  return useQuery({
    queryKey: ['pingServer'],
    queryFn: pingServer,
    ...queryConfig,
  });
};

export const useToggleUrl = ({ mutationConfig }: { mutationConfig?: any } = {}) => {
  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation<any, Error, string>({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    onError: (...args) => {
      onError?.(...args);
    },
    ...restConfig,
    mutationFn: toggleUrl,
  });
};