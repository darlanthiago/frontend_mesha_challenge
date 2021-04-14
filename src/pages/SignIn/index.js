import { useCallback, useState } from "react";

//libs
import { useForm } from "react-hook-form";

import { Link } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

//style
import { Wrapper, Content } from "../_layouts/auth/authStyle";

//assets
import Logo from "../../assets/logo.svg";

//context
import { useReactAuth } from "../../contexts/hooks/AuthContext";
import SubmitButton from "../../components/SubmitButton";
import { FaSignInAlt } from "react-icons/fa";
import { Spinner } from "react-bootstrap";

//validations
const schema = Yup.object().shape({
  email: Yup.string()
    .email("*E-mail inválido")
    .required("*O campo e-mail é obrigatório"),
  password: Yup.string().required("*O campo senha é obrigatório"),
});

function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { signIn, loading } = useReactAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [loadingImage, setLoadingImage] = useState(false);

  const onSubmit = useCallback(
    ({ email, password }) => {
      signIn(email, password);
    },
    [signIn]
  );

  function toggleShowPass() {
    setShowPassword(!showPassword);
  }

  const onLoadLogo = useCallback(() => {
    setLoadingImage(true);
  }, []);

  return (
    <Wrapper>
      <Content>
        <img src={Logo} height="100" alt="Clinic Medical" onLoad={onLoadLogo} />

        {loadingImage ? (
          <>
            <form onSubmit={handleSubmit(onSubmit)} method="POST">
              <input
                name="email"
                type="email"
                placeholder="Seu endereço de e-mail"
                {...register("email")}
              />
              {errors.email && <span>{errors.email.message}</span>}
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha secreta"
                {...register("password")}
              />
              {errors.password && <span>{errors.password.message}</span>}
              <small
                onClick={toggleShowPass}
                style={{ marginTop: 10, textAlign: "left", cursor: "pointer" }}
              >
                {showPassword ? "Esconder" : "Mostrar"} senha
              </small>
              <SubmitButton loading={loading}>
                <FaSignInAlt className="mr-2" />
                Acessar
              </SubmitButton>
              <div className="d-flex justify-content-center mt-3">
                <Link to="/forgot-password">Esqueci minha senha</Link>
              </div>
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

export default SignIn;
