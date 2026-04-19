import { Dashboard, DefaultLayout } from "../components";
import AuthGuard from "../components/common/AuthGuard";

export default function DashboardPage() {
  return (
    <AuthGuard mode="auth">
      <DefaultLayout>
        <Dashboard />
      </DefaultLayout>
    </AuthGuard>
  );
}