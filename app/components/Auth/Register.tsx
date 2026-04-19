"use client";
import React from 'react';
import { Input, Button, Form, Notification, Flex } from '../common';
import { useRegister } from '../../Services';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ALREADY_HAVE_AN_ACCOUNT, LOGIN, REGISTER, REGISTRATION_SUCCESSFUL, REGISTRATION_FAILED, PAGE_ROUTES } from '@/app/constants';
import OAuthButtons from './OAuthButtons';

const Register: React.FC = () => {
  const router = useRouter();

  const { mutate: registerMutation, isPending } = useRegister({
    mutationConfig: {
      onSuccess: () => {
        Notification(REGISTRATION_SUCCESSFUL, 'success');
        router.push(PAGE_ROUTES.LOGIN);
      },
      onError: (error: any) => {
        Notification(error.response?.data?.message || REGISTRATION_FAILED, 'error');
      }
    }
  });

  const onFinish = (values: any) => {
    registerMutation(values);
  };

  const formItem = [
    {
      name: 'name',
      formItemProps: {
        rules: [{ required: true, message: 'Please input your name!' }],
      },
      children: <Input type="text" placeholder="Full name" size="large" className="!h-12 !rounded-xl !text-base" />,
    },
    {
      name: 'email',
      formItemProps: {
        rules: [{ required: true, message: 'Please input your email!', type: 'email' }],
      },
      children: <Input type="email" placeholder="Email address" size="large" className="!h-12 !rounded-xl !text-base" />,
    },
    {
      name: 'password',
      formItemProps: {
        rules: [{ required: true, message: 'Please input your password!' }],
      },
      children: <Input type="password" placeholder="Password" size="large" className="!h-12 !rounded-xl !text-base" />,
    },
    {
      children: (
        <Button type="primary" htmlType="submit" loading={isPending} block size="large" className="!h-12 !rounded-xl !font-bold !text-base !shadow-md hover:!shadow-lg transition-shadow">
          {REGISTER}
        </Button>
      )
    }
  ];

  return (
    <Flex align="center" justify="center" className="min-h-[85vh] p-6 w-full">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black font-heading tracking-tight mb-2 text-[var(--foreground)]">
            Create account
          </h1>
          <p className="text-[var(--foreground-muted)] text-base">
            Start shortening your links in seconds
          </p>
        </div>

        <div className="bg-[var(--background-subtle)] border border-[var(--border-default)] rounded-2xl p-5 m-3 shadow-lg">
          <Form onFinish={onFinish} layout="vertical" items={formItem} className="w-full" />
          <OAuthButtons mode="signup" />
        </div>

        <p className="text-center mt-6 text-sm text-[var(--foreground-muted)]">
          {ALREADY_HAVE_AN_ACCOUNT}{' '}
          <Link href="/login" className="text-[var(--primary)] font-semibold hover:underline">
            {LOGIN}
          </Link>
        </p>
      </div>
    </Flex>
  );
};

export default Register;
