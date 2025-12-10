import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/app/app-dispatch';
import { loginThunk, signupThunk } from '@/features/auth/auth-slice';
import { useNavigate } from '@tanstack/react-router';

const signupFormSchema = z.object({
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters long')
    .max(50, 'Username must be at most 50 characters long'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const useSignupForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const result = await dispatch(signupThunk(data));
    if (signupThunk.fulfilled.match(result)) {
      form.reset();
      navigate({ to: '/app/notes/new' });
    }
  });

  return { form, onSubmit, loading, error };
};

const loginFormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const useLoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.auth);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const result = await dispatch(loginThunk(data));

    if (loginThunk.fulfilled.match(result)) {
      form.reset();
      navigate({ to: '/app/notes/new' });
    }
  });

  return { form, onSubmit, loading, error };
};
