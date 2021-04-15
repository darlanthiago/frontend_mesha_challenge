import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import api from "../../../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const [user, setUser] = useState({});

  useEffect(() => {
    (async () => {
      const tokenStorage = localStorage.getItem("@RJSAuth:token");
      const userStorage = localStorage.getItem("@RJSAuth:user");

      if (!tokenStorage || !userStorage) {
        setLoading(false);
        return;
      }

      setLoading(true);
      //check token is valid

      await api
        .get("/api/user/me", {
          headers: {
            Authorization: `Bearer ${tokenStorage}`,
          },
        })
        .then((resp) => {
          if (resp.data) {
            setUser(resp.data);
            api.defaults.headers["Authorization"] = `Bearer ${tokenStorage}`;
            setLoading(false);
            return;
          }

          setLoading(false);
          history.push("/login");
        })
        .catch((error) => {
          localStorage.removeItem("@RJSAuth:token");
          localStorage.removeItem("@RJSAuth:user");
          delete api.defaults.headers.common["Authorization"];
          delete api.defaults.headers.common["XSRF-TOKEN"];
          Cookies.remove("XSRF-TOKEN");
          setLoading(false);
          toast.error("❌ Ops! Faça login novamente!");
          return;
        });
    })();
  }, [history]);

  const signIn = useCallback(
    async (email, password) => {
      setLoading(true);

      await api.get("/sanctum/csrf-cookie");
      api
        .post("/api/auth/login", {
          email,
          password,
        })
        .then((response) => {
          const { token, user } = response.data;

          api.defaults.headers["Authorization"] = `Bearer ${token}`;

          localStorage.setItem("@RJSAuth:user", JSON.stringify(user));
          localStorage.setItem("@RJSAuth:token", token);

          setUser(user);
          setLoading(false);

          history.push("/");

          toast.success("✅ Login feito com sucesso!");

          return;
        })
        .catch((error) => {
          setUser({});
          setLoading(false);
          toast.error(
            "❌ Erro no login, verifique os dados e tente novamente!"
          );
        });
    },
    [history]
  );

  const signOut = useCallback(async () => {
    const tokenStorage = localStorage.getItem("@RJSAuth:token");
    const userStorage = localStorage.getItem("@RJSAuth:user");

    if (!tokenStorage || !userStorage) {
      setLoading(false);
      history.push("/login");
      return;
    }

    setLoading(true);

    await api
      .delete("/api/auth/logout")
      .then((resp) => {
        localStorage.removeItem("@RJSAuth:token");
        localStorage.removeItem("@RJSAuth:user");
        delete api.defaults.headers.common["Authorization"];
        delete api.defaults.headers.common["XSRF-TOKEN"];
        Cookies.remove("XSRF-TOKEN");
        setUser({});
        setLoading(false);
        history.push("/login");
        toast.success("✅ Logout feito com sucesso!");
      })
      .catch((error) => {
        localStorage.removeItem("@RJSAuth:token");
        localStorage.removeItem("@RJSAuth:user");
        delete api.defaults.headers.common["Authorization"];
        delete api.defaults.headers.common["XSRF-TOKEN"];
        Cookies.remove("XSRF-TOKEN");
        setUser({});
        setLoading(false);
        toast.error("❌ Ops, algo deu errado! Faça o login novamente.");
        history.push("/login");
      });
  }, [history]);

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, setUser, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useReactAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useReactAuth must be used within an AuthProvider");
  }

  return context;
}
