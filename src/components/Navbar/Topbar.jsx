import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function TopBar() {
  const { user, logout } = useAuth();

  return (
    <div
      style={{
        height: "60px",
        width: "97%",
        background: "#0e1628",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 30px",
        color: "white",
        borderBottom: "1px solid #1f2a46",
      }}
    >
      {!user ? (
        <Link
          to="/login"
          style={{
            padding: "8px 16px",
            background: "#3b82f6",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          Sign In
        </Link>
      ) : (
        <button
          onClick={logout}
          style={{
            padding: "8px 16px",
            background: "#ef4444",
            color: "white",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Logout ({user.email})
        </button>
      )}
    </div>
  );
}

