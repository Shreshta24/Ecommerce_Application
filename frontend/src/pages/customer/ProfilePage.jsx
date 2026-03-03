import { useAuth } from "../../auth/AuthContext";

export function CustomerProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div>
      <h1>My Profile</h1>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
      <p>This is where you can extend to allow editing profile details.</p>
    </div>
  );
}

