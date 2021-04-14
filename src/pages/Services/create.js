import { useCallback, useState } from "react";
import { Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaSave } from "react-icons/fa";
import SubmitButtonApp from "../../components/SubmitButton/app";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import api from "../../services/api";
import { toast } from "react-toastify";

const schema = Yup.object().shape({
  name: Yup.string().required("*O campo nome é obrigatório"),
  value: Yup.number()
    .typeError("*Digite um valor válido")
    .required("*O campo valor é obrigatório"),
  duration: Yup.number()
    .typeError("*Digite uma duração válida")
    .required("*O campo nome é obrigatório"),
});

function ServicesCreate() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(
    async ({ name, value, duration }) => {
      setLoading(true);

      await api
        .post("/api/service", { name, value, duration })
        .then((resp) => {
          setLoading(false);
          toast.success("✅ Serviço inserido com sucesso!");
          reset();
        })
        .catch((error) => {
          setLoading(false);
          toast.error("❌ Serviço não pode ser inserido!");
        });
    },
    [reset]
  );

  return (
    <>
      <h1 className="text-center mb-5">Novo Serviço</h1>
      <Form onSubmit={handleSubmit(onSubmit)} method="POST">
        <Form.Row>
          <Col>
            <Form.Group>
              <Form.Label>Nome do Serviço</Form.Label>
              <Form.Control
                name="name"
                placeholder="Nome do Serviço"
                {...register("name", { required: true })}
              />

              {errors.name && (
                <span className="text-danger">{errors.name.message}</span>
              )}
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>Valor do Serviço</Form.Label>
              <Form.Control
                name="value"
                type="number"
                placeholder="Valor do Serviço"
                {...register("value", { required: true })}
              />
              {errors.value && (
                <span className="text-danger">{errors.value.message}</span>
              )}
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>Duração do Serviço (em minutos)</Form.Label>
              <Form.Control
                name="duration"
                type="number"
                placeholder="Duração do Serviço"
                {...register("duration", { required: true })}
              />
              {errors.duration && (
                <span className="text-danger">{errors.duration.message}</span>
              )}
            </Form.Group>
          </Col>
        </Form.Row>

        <SubmitButtonApp color="primary" loading={loading}>
          <FaSave className="mr-2" />
          Salvar
        </SubmitButtonApp>
      </Form>
    </>
  );
}

export default ServicesCreate;
