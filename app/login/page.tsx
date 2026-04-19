import { Login, DefaultLayout } from "../components";
import AuthGuard from "../components/common/AuthGuard";

export default function LoginPage() {
  return (
    <AuthGuard mode="guest">
      <DefaultLayout>
        <Login />
      </DefaultLayout>
    </AuthGuard>
  );
}
