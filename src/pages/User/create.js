import { useCallback, useEffect, useState } from "react";
import PrevButton from "../../components/PrevButton";

//libs
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import api from "../../services/api";
import SubmitButtonApp from "../../components/SubmitButton/app";
import { useHistory } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import { Col, Form } from "react-bootstrap";

//validations
var mediumRegex = new RegExp(
  "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
);

const schema = Yup.object().shape({
  name: Yup.string().required("*O campo nome é obrigatório"),
  email: Yup.string()
    .email("*E-mail inválido")
    .required("*O campo e-mail é obrigatório"),
  password: Yup.string()
    .required("*O campo senha é obrigatório")
    .matches(
      mediumRegex,
      "A senha deve conter 8 caracteres, uma maiúscula[A-Z], uma minúscula[a-z], um número e um caractere especial(@$!%*#?&)"
    )
    .min(8, "*Mínimo de 8 caracteres")
    .max(16, "*Máximo de 16 caracteres"),
});

function UserCreate() {
  const [submitLoading, setSubmitLoading] = useState(false);

  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue("profile", "employee");
  }, [setValue]);

  const onSubmit = useCallback(
    async ({ name, email, password, is_approved, profile }) => {
      // console.log(name, email, password, is_approved, profile);
      setSubmitLoading(true);

      await api
        .post(`/api/user/register`, {
          name,
          email,
          password,
          is_approved,
          profile,
        })
        .then((resp) => {
          setSubmitLoading(false);

          toast.success("✅ Usuário criado com sucesso!");

          setTimeout(() => {
            history.push(`/user-view/${resp.data.id}`);
          }, 1500);
        })
        .catch((error) => {
          setSubmitLoading(false);

          return toast.error(
            "❌ Ops, algo deu errado, verifique os dados e tente novamente."
          );
        });
    },
    [history]
  );
  return (
    <>
      <PrevButton color="primary" isButton={false} size="sm" />

      <Form className="mt-5" method="POST" onSubmit={handleSubmit(onSubmit)}>
        <Form.Row>
          <Col>
            <Form.Group controlId="name">
              <Form.Label>Nome e Sobrenome</Form.Label>
              <Form.Control
                name="name"
                placeholder="Nome e Sobrenome"
                {...register("name")}
              />
              {errors.name && (
                <span className="text-danger">{errors.name.message}</span>
              )}
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="email">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="email"
                name="email"
                {...register("email")}
                placeholder="email@example.com"
              />
              {errors.email && (
                <span className="text-danger">{errors.email.message}</span>
              )}
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="password">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="text"
                name="password"
                {...register("password")}
                placeholder="Digite a senha"
              />
              {errors.password && (
                <span className="text-danger">{errors.password.message}</span>
              )}
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Label>Perfil</Form.Label>
            <Form.Group controlId="profile">
              <Form.Check
                custom
                inline
                label="Admin"
                type="radio"
                value="admin"
                id={`profile-create-1`}
                {...register("profile")}
              />
              <Form.Check
                custom
                inline
                label="Cliente"
                type="radio"
                value="user"
                id={`profile-create-2`}
                {...register("profile")}
              />
              <Form.Check
                custom
                inline
                label="Funcionário"
                type="radio"
                name="profile"
                value="employee"
                id={`profile-create-3`}
                {...register("profile")}
              />

              {errors.profile && (
                <span className="text-danger">{errors.profile.message}</span>
              )}
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Label>Conceder Acesso</Form.Label>
            <Form.Group controlId="is_approved">
              <Form.Check
                custom
                inline
                label="Sim"
                type="switch"
                name="is_approved"
                {...register("is_approved")}
              />
            </Form.Group>
          </Col>
        </Form.Row>

        <SubmitButtonApp color="primary" loading={submitLoading}>
          <FaSave className="mr-2" />
          Salvar
        </SubmitButtonApp>
      </Form>
    </>
  );
}

export default UserCreate;
