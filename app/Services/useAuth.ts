  import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
  import { login, register, getCurrentUser, logout } from "./authService";
  import { LOCAL_STORAGE_KEY } from "../constants";

  export const useCurrentUser = (options = {}) => {
    return useQuery({
      queryKey: ["currentUser"],
      queryFn: getCurrentUser,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false,
      ...options,
    });
  };

  export const useLogin = ({ mutationConfig }: { mutationConfig?: any } = {}) => {
    const { onSuccess, onError, ...restConfig } = mutationConfig || {};

    return useMutation<any, Error, any>({
      mutationFn: login,
      onSuccess: (data) => {
        onSuccess?.(data);
      },
      onError: (error) => {
        onError?.(error);
      },
      ...restConfig,
    });
  };

  export const useRegister = ({ mutationConfig }: { mutationConfig?: any } = {}) => {
    const { onSuccess, onError, ...restConfig } = mutationConfig || {};  

    return useMutation({
      mutationFn: register, 
      onSuccess: (data) => {
        onSuccess?.(data);
      },
      ...restConfig,
    });
  };

  export const useLogout = () => {
      const queryClient = useQueryClient();
      return () => {
          logout();
          queryClient.setQueryData(["currentUser"], null);
          queryClient.clear();
          window.location.href = "/login";
      }
  }
