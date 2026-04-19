import { Register, DefaultLayout } from "../components";
import AuthGuard from "../components/common/AuthGuard";

export default function RegisterPage() {
  return (
    <AuthGuard mode="guest">
      <DefaultLayout>
        <Register />
      </DefaultLayout>
    </AuthGuard>
  );
}
