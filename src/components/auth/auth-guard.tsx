import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import { isAuthenticated } from '@/lib/auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isAuthenticated: isAuthed } = useAuthStore();

  useEffect(() => {
    if (!isAuthed && !isAuthenticated()) {
      navigate('/login', { replace: true });
    }
  }, [isAuthed, navigate]);

  if (!isAuthed && !isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}