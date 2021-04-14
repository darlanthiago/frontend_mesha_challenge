import { useEffect, useState } from "react";
import { Badge, Card, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../services/api";
import formatCurrency from "../../utils/formatCurrency";

function Services() {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);

      await api.get("/api/service").then((resp) => {
        setServices(resp.data);
        setLoading(false);
      });
    })();
  }, []);

  if (loading) {
    <div className="text-center">
      <Spinner animation="border" variant="primary" />
    </div>;
  }

  return (
    <>
      <h1 className="text-center mb-5">Serviços</h1>

      <Link to="/service-create" className="btn btn-primary">
        <FaPlus className="mr-2" />
        Novo Serviço
      </Link>

      <Row className="mt-2">
        {services.map((item, index) => (
          <Col md={3} sm={12} className="mt-2">
            <Card key={index}>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>Duração: {item.duration} minutos</Card.Text>
                <Card.Text>
                  Valor:{" "}
                  <Badge variant="success">{formatCurrency(item.value)}</Badge>
                </Card.Text>
                <Card.Text>
                  <small className="text-muted">
                    Inserido em:{" "}
                    {new Intl.DateTimeFormat("pt-BR").format(
                      new Date(item.created_at)
                    )}
                  </small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default Services;
