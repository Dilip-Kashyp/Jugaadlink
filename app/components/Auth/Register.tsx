"use client";
import React, { useEffect, useRef } from 'react';
import { Input, Button, Form, Notification } from '../common';
import { useRegister } from '../../Services';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ALREADY_HAVE_AN_ACCOUNT, LOGIN, REGISTER, REGISTRATION_SUCCESSFUL, REGISTRATION_FAILED, LOGIN_URL } from '@/app/constants';
import gsap from 'gsap';

const Register: React.FC = () => {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current, 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  const { mutate: registerMutation, isPending } = useRegister({
    mutationConfig: {
      onSuccess: () => {
        Notification(REGISTRATION_SUCCESSFUL, 'success');
        router.push(LOGIN_URL);
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
      children: <Input type="text" inputProps={{ placeholder: 'Full Name', size: 'large', className: "!bg-[var(--secondary)] !border-[var(--border-width)] !border-[var(--border-default)] !shadow-[2px_2px_0_0_var(--border-default)]" }} />,
    },
    {
      name: 'email',
      formItemProps: {
        rules: [{ required: true, message: 'Please input your email!', type: 'email' }],
      },
      children: <Input type="email" inputProps={{ placeholder: 'Email Address', size: 'large', className: "!bg-[var(--secondary)] !border-[var(--border-width)] !border-[var(--border-default)] !shadow-[2px_2px_0_0_var(--border-default)]" }} />,
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
        {REGISTER}
      </Button>
    }
  ];

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 bg-[var(--background)] font-body">
      <div 
        ref={cardRef} 
        className="w-full max-w-4xl flex flex-row-reverse neo-brutal bg-[var(--secondary)] shadow-[8px_8px_0_0_var(--foreground)] p-0"
      >
        {/* Right Form Side */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-[var(--secondary)]">
          <h2 className="font-heading font-black text-5xl leading-tight mb-8 text-[var(--foreground)]">
            CREATE<br/>ACCOUNT.
          </h2>
          <Form formProps={{ onFinish, layout: 'vertical' }} formItem={formItem} />
          <div className="mt-8 font-bold text-center text-sm uppercase tracking-widest border-t-[var(--border-width)] border-[var(--border-default)] pt-6 text-[var(--foreground-subtle)]">
            {ALREADY_HAVE_AN_ACCOUNT} 
            <Link href="/login" className="text-[var(--primary)] border-b-2 border-transparent hover:border-[var(--primary)] hover:text-[var(--foreground)] px-2 py-1 ml-1 transition-all">{LOGIN}</Link>
          </div>
        </div>

        {/* Left Graphic Side (Simplified) */}
        <div className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden bg-[var(--foreground)] border-r-[var(--border-width)] border-[var(--border-default)]">
           {/* Abstract minimalist shapes instead of gif */}
           <div className="absolute opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #FFF 25%, transparent 25%, transparent 75%, #FFF 75%, #FFF), linear-gradient(45deg, #FFF 25%, transparent 25%, transparent 75%, #FFF 75%, #FFF)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }}></div>
           
           <div className="z-10 bg-[var(--primary)] text-[var(--foreground)] px-8 py-6 border-[var(--border-width)] border-[var(--secondary)] rotate-2 shadow-[8px_8px_0_0_var(--secondary)] hover:rotate-0 transition-transform duration-300">
             <h3 className="font-heading font-black text-4xl uppercase m-0 leading-none">Join<br/>Now</h3>
             <div className="mt-4 w-full h-[6px] bg-[var(--foreground)]"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
