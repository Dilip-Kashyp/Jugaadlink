"use client";
import React, { useEffect, useRef } from 'react';
import { message } from 'antd';
import { Input, Button, Form } from '../common';
import { useLogin } from '../../Services';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DASHBOARD_URL, DONT_HAVE_AN_ACCOUNT, LOGIN, LOGIN_FAILED, LOGIN_SUCCESSFUL } from '@/app/constants';
import gsap from 'gsap';

const Login: React.FC = () => {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    gsap.fromTo(cardRef.current, 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  const { mutate: loginMutation, isPending } = useLogin({
    mutationConfig: {
      onSuccess: () => {
        message.success(LOGIN_SUCCESSFUL);
        router.push(DASHBOARD_URL);
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
      children: <Input type="email" inputProps={{ placeholder: 'Email', size: 'large', className: "!bg-[var(--secondary)] !border-[var(--border-width)] !border-[var(--border-default)] !shadow-[2px_2px_0_0_var(--border-default)]" }} />,
    },
    {
      name: 'password',
      formItemProps: {
        rules: [{ required: true, message: 'Please input your password!' }],
      },
      children: <Input type="password" inputProps={{ placeholder: 'Password', size: 'large', className: "!bg-[var(--secondary)] !border-[var(--border-width)] !border-[var(--border-default)] !shadow-[2px_2px_0_0_var(--border-default)]" }} />,
    },
    {
      children: <Button buttonProps={{ type: 'primary', htmlType: 'submit', loading: isPending, block: true, size: 'large', className: "!bg-[var(--foreground)] !text-[var(--secondary)] !border-[var(--border-width)] !border-[var(--border-default)] hover:!bg-[var(--primary)] hover:!text-[var(--foreground)] transition-colors !h-12 !font-black !uppercase tracking-widest shadow-[4px_4px_0_0_var(--border-default)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none" }}>
        {LOGIN}
      </Button>
    }
  ];

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 bg-[var(--background)] font-body">
      <div 
        ref={cardRef} 
        className="w-full max-w-4xl flex justify-center neo-brutal bg-[var(--secondary)] shadow-[8px_8px_0_0_var(--foreground)] p-0"
      >
        {/* Left Form Side */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center">
          <h2 className="font-heading font-black text-5xl leading-tight mb-8 text-[var(--foreground)]">
            WELCOME<br/>BACK.
          </h2>
          <Form formProps={{ onFinish, layout: "vertical" }} formItem={formItem} />
          <div className="mt-8 font-bold text-center text-sm uppercase tracking-widest border-t-[var(--border-width)] border-[var(--border-default)] pt-6 text-[var(--foreground-subtle)]">   
            {DONT_HAVE_AN_ACCOUNT} 
            <Link href="/signup" className="text-[var(--primary)] border-b-2 border-transparent hover:border-[var(--primary)] hover:text-[var(--foreground)] px-2 py-1 ml-1 transition-all">Sign Up</Link>
          </div>
        </div>
        
        {/* Right Graphic Side (Simplified) */}
        <div className="hidden md:flex w-1/2 bg-[var(--primary)] border-l-[var(--border-width)] border-[var(--border-default)] items-center justify-center relative overflow-hidden flex-col p-12 text-center bg-stripes">
           <div className="absolute inset-0 pattern-dots opacity-20"></div>
           <div className="z-10 bg-[var(--secondary)] text-[var(--foreground)] p-8 border-[var(--border-width)] border-[var(--border-default)] shadow-[4px_4px_0_0_var(--foreground)] -rotate-3 hover:rotate-0 transition-transform duration-300">
             <h3 className="font-heading font-black text-4xl uppercase m-0 leading-none">Access<br/>Portal</h3>
             <p className="mt-4 font-bold text-sm tracking-widest opacity-80 uppercase">Enter credentials to continue</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;