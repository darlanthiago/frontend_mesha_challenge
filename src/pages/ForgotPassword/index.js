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

import api from "../../services/api";
import { toast } from "react-toastify";
import SubmitButton from "../../components/SubmitButton";
import { FaRegPaperPlane } from "react-icons/fa";
import { Spinner } from "react-bootstrap";

//validations
const schema = Yup.object().shape({
  email: Yup.string()
    .email("*E-mail inválido")
    .required("*O campo e-mail é obrigatório"),
});

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const [loadingImage, setLoadingImage] = useState(false);

  function onSubmit({ email }) {
    setLoading(true);

    api
      .put("/api/auth/forgot-password", {
        email,
      })
      .then((resp) => {
        setLoading(false);

        return toast.success(
          "✅ Pedido de senha enviado com sucesso! Verifique seu e-mail."
        );
      })
      .catch((error) => {
        setLoading(false);

        if (error.response.status === 404) {
          return toast.error("❌ Usuário não cadastrado!");
        }

        return toast.error(
          "❌ Ops! Deu algo errado, verifique os dados e tente novamente!"
        );
      });
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

              <SubmitButton loading={loading}>
                <FaRegPaperPlane className="mr-2" />
                Enviar
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
