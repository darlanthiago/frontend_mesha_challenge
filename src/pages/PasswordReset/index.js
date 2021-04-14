import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import useQuery from "../../contexts/hooks/QueryParams";
import Loading from "../../components/Loading";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { FiSave } from "react-icons/fi";

//libs
import api from "../../services/api";

//style
import { Wrapper, Content } from "../_layouts/auth/authStyle";
import SubmitButton from "../../components/SubmitButton";

//assets
import Logo from "../../assets/logo.svg";
import { Spinner } from "react-bootstrap";

//validations
const schema = Yup.object().shape({
  password: Yup.string().required("*O campo senha é obrigatório"),
  passwordVerification: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "*A confirmação de senha deve ser igual a nova senha"
  ),
});

function PasswordReset() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const query = useQuery();
  const token = query.get("token");
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [data, setData] = useState({});

  const [showPassword, setShowPassword] = useState(false);

  const [loadingImage, setLoadingImage] = useState(false);

  async function onSubmit({ password, passwordVerification }) {
    setSubmitLoading(true);

    await api
      .put("/api/auth/password-reset", {
        email: data.email,
        token: token,
        password: password,
        password_verification: passwordVerification,
      })
      .then((resp) => {
        setSubmitLoading(false);
        toast.success("✅ Senha alterada com sucesso!");
        toast.success("🤙 Agora pode fazer login!");
        return history.push("/login");
      })
      .catch((error) => {
        setSubmitLoading(false);
        toast.error("❌ Ops! Algo deu errado! Tente novamente!");
        return;
      });
  }

  function toggleShowPass() {
    setShowPassword(!showPassword);
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      await api
        .get(`/api/auth/password-reset-token/${token}`)
        .then((resp) => {
          setLoading(false);
          setData(resp.data);
        })
        .catch((error) => {
          setLoading(false);
          toast.error("❌ Ops, solicite outro reset de senha!");
          return history.push("/forgot-password");
        });
    }

    loadData();
  }, [history, token]);

  const onLoadLogo = useCallback(() => {
    setLoadingImage(true);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <Content>
        <img src={Logo} height="100" alt="Clinic Medical" onLoad={onLoadLogo} />

        {loadingImage ? (
          <>
            <form onSubmit={handleSubmit(onSubmit)} method="POST">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Sua nova senha"
                {...register("password")}
              />

              {errors.password && <span>{errors.password.message}</span>}

              <input
                name="passwordVerification"
                type={showPassword ? "text" : "password"}
                placeholder="Confirme sua nova senha"
                {...register("passwordVerification")}
              />

              {errors.passwordVerification && (
                <span>{errors.passwordVerification.message}</span>
              )}

              <small
                onClick={toggleShowPass}
                style={{ marginTop: 10, textAlign: "left", cursor: "pointer" }}
              >
                {showPassword ? "Esconder" : "Mostrar"} senha
              </small>

              <SubmitButton loading={submitLoading}>
                <FiSave className="mr-2" />
                Salvar
              </SubmitButton>

              <Link to="/login">Login</Link>
            </form>
          </>
        ) : (
          <Spinner animation="border" role="status" variant="primary">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
      </Content>
    </Wrapper>
  );
}

export default PasswordReset;
