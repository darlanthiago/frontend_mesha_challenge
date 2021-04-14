import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

//libs
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";

//services

import api from "../../services/api";

//components
import SubmitButtonApp from "../../components/SubmitButton/app";
import PrevButton from "../../components/PrevButton";
import Loading from "../../components/Loading";
import { Col, Form } from "react-bootstrap";
import { FaSave } from "react-icons/fa";

//validations
const schema = Yup.object().shape({
  name: Yup.string().required("*O campo nome é obrigatório"),
  email: Yup.string()
    .email("*E-mail inválido")
    .required("*O campo e-mail é obrigatório"),
});

function UserView() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { id } = useParams();

  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      await api
        .get(`/api/user/${id}`)
        .then((resp) => {
          reset({
            name: resp.data.name,
            email: resp.data.email,
            is_approved: resp.data.is_approved,
            profile: resp.data.profile,
          });

          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          toast.error(
            "❌ Usuário não encontrado, em instantes você será redirecionado!"
          );
          setTimeout(() => {
            history.push("/user");
          }, 2000);
        });
    })();
  }, [history, id, reset]);

  async function onSubmit({ name, email, is_approved, profile }) {
    setSubmitLoading(true);

    await api
      .put(`/api/user/${id}`, {
        name,
        email,
        is_approved,
        profile,
      })
      .then((resp) => {
        reset({
          name: resp.data.name,
          email: resp.data.email,
          is_approved: resp.data.is_approved,
          profile: resp.data.profile,
        });

        setSubmitLoading(false);

        return toast.success("✅ Dados alterados com sucesso!");
      })
      .catch((error) => {
        setSubmitLoading(false);

        return toast.error(
          "❌ Ops, algo deu errado, verifique os dados e tente novamente."
        );
      });
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <PrevButton color="primary" isButton={false} size="sm" url="/user" />

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
                name="profile"
                value="admin"
                {...register("profile")}
              />
              <Form.Check
                custom
                inline
                label="Cliente"
                type="radio"
                name="profile"
                value="user"
                {...register("profile")}
              />
              <Form.Check
                custom
                inline
                label="Funcionário"
                type="radio"
                name="profile"
                value="employee"
                {...register("profile")}
              />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Label>Acesso Concedido</Form.Label>
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

export default UserView;
