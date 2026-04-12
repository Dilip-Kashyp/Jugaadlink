import { useMutation, useQuery } from "@tanstack/react-query";
import { shortenUrl, getUrlHistory, deleteUrl, getUrlAnalytics, UrlHistoryResponse } from "./urlService";

type url = {
  original_url: string,
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