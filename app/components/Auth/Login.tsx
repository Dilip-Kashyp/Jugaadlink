"use client";
import React from 'react';
import { message } from 'antd';
import { Input, Button, Form, Flex } from '../common';
import { useLogin } from '../../Services';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PAGE_ROUTES, DONT_HAVE_AN_ACCOUNT, LOGIN, LOGIN_FAILED, LOGIN_SUCCESSFUL } from '@/app/constants';
import OAuthButtons from './OAuthButtons';

const Login: React.FC = () => {
  const router = useRouter();

  const { mutate: loginMutation, isPending } = useLogin({
    mutationConfig: {
      onSuccess: () => {
        message.success(LOGIN_SUCCESSFUL);
        router.push(PAGE_ROUTES.DASHBOARD);
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || LOGIN_FAILED);
      }
    }
  });

  const onFinish = (values: any) => {
    loginMutation(values);
  };

  const formItem = [
    {
      name: 'email',
      formItemProps: {
        rules: [{ required: true, message: 'Please input your email!' }],
      },
      children: <Input type="email" placeholder="Email address" size="large" className="!h-12 !rounded-xl !text-base" />,
    },
    {
      name: 'password',
      rules: [{ required: true, message: 'Please input your password!' }],
      children: <Input type="password" placeholder="Password" size="large" className="!h-12 !rounded-xl !text-base" />,
    },
    {
      children: (
        <Button type="primary" htmlType="submit" loading={isPending} block size="large" className="!h-12 !rounded-xl !font-bold !text-base !shadow-md hover:!shadow-lg transition-shadow">
          {LOGIN}
        </Button>
      )
    }
  ];

  return (
    <Flex align="center" justify="center" className="min-h-[85vh] p-6 w-full">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black font-heading tracking-tight mb-2 text-[var(--foreground)]">
            Welcome back
          </h1>
          <p className="text-[var(--foreground-muted)] text-base">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-2xl p-8 shadow-lg">
          <Form onFinish={onFinish} layout="vertical" items={formItem} className="w-full" />
          <OAuthButtons mode="login" />
        </div>

        <p className="text-center mt-6 text-sm text-[var(--foreground-muted)]">
          {DONT_HAVE_AN_ACCOUNT}{' '}
          <Link href="/signup" className="text-[var(--primary)] font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </Flex>
  );
};

export default Login;