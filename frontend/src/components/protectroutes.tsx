import { Navigate, Outlet } from 'react-router-dom';

type Props = {
  isAllowed: boolean;
  redirectPath?: string;
};

export function ProtectedRoute({ isAllowed, redirectPath = '/signup' }: Props) {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
}
