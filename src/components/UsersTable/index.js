import { useState, useEffect, useCallback } from "react";
import {
  FaEye,
  FaPlus,
  FaTrash,
  FaTrashRestore,
  FaUserAltSlash,
  FaUserCheck,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../services/api";
import {
  Badge,
  Col,
  Container,
  Form,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";

import { useReactAuth } from "../../contexts/hooks/AuthContext";

function UsersTable({ url }) {
  const { user } = useReactAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPag] = useState(null);

  const [showTotal, setShowTotal] = useState({
    total: 0,
    from: 0,
    to: 0,
    per_page: 10,
    totalPages: 0,
  });

  const [pages, setPages] = useState([]);
  const [limit, setLimit] = useState(10);
  const [selectTotalShow] = useState([5, 10, 15, 20, 30]);
  const [maxVisibleButtons] = useState(8);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isFirstPage, setIsFirstPage] = useState(false);

  const [loading, setLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      await api.get(`${url}?page=${page}&limit=${limit}`).then((resp) => {
        const usersData = resp.data.data.map((user) => {
          return {
            ...user,
            trashed: user.deleted_at !== null ? true : false,
          };
        });

        setUsers(usersData);

        setLastPag(resp.data.last_page);

        setShowTotal({
          total: resp.data.total,
          from: resp.data.from,
          to: resp.data.to,
          per_page: resp.data.per_page,
          totalPages: resp.data.last_page,
        });

        const totalPages = resp.data.last_page;

        let maxLeft = page - Math.floor(maxVisibleButtons / 2);
        let maxRight = page + Math.floor(maxVisibleButtons / 2);

        if (maxLeft <= 1) {
          maxLeft = 1;
          maxRight = maxVisibleButtons;
        }

        if (maxRight > totalPages) {
          maxLeft = totalPages - (maxVisibleButtons - 1);
          maxRight = totalPages;
        }

        const arrayPages = [];

        for (let page = maxLeft; page <= maxRight; page++) {
          arrayPages.push(page);
        }

        const filteredArrayPages = arrayPages.filter((nr) => nr > 0);

        setPages(filteredArrayPages);

        setLoading(false);

        page === 1 ? setIsFirstPage(true) : setIsFirstPage(false);

        page === lastPage || lastPage === null
          ? setIsLastPage(true)
          : setIsLastPage(false);
      });
    })();
  }, [lastPage, limit, maxVisibleButtons, page, url]);

  const nextPage = useCallback(() => {
    if (page === lastPage) {
      return;
    }

    setPage(page + 1);
  }, [lastPage, page]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  //action functions

  async function updateUser(userId, options) {
    setUsers(
      users.map((u) => {
        if (u.id === userId) {
          u = {
            ...u,
            ...options,
          };
        }
        return u;
      })
    );
  }

  async function handleDisapproved(userId) {
    setActionLoading(true);
    await api
      .put(`/api/user/${userId}?action=disapproved`)
      .then(async (resp) => {
        await updateUser(userId, {
          is_approved: false,
        });

        setActionLoading(false);
        toast.success("✅ Acesso removido com sucesso!");
      })
      .catch((error) => {
        setActionLoading(false);
        toast.error("❌ Não foi possível remover acesso!");
      });
  }

  async function handleApproved(userId) {
    setActionLoading(true);
    await api
      .put(`/api/user/${userId}?action=approved`)
      .then(async (resp) => {
        await updateUser(userId, {
          is_approved: true,
        });

        setActionLoading(false);
        toast.success("✅ Acesso concedido com sucesso!");
      })
      .catch((error) => {
        setActionLoading(false);
        toast.error("❌ Não foi possível dar acesso!");
      });
  }

  async function handleRestoreUser(userId) {
    setActionLoading(true);
    await api
      .put(`/api/user/${userId}?action=restore`)
      .then(async (resp) => {
        await updateUser(userId, {
          trashed: false,
        });

        setActionLoading(false);
        toast.success("✅ Usuário restaurado com sucesso!");
      })
      .catch((error) => {
        setActionLoading(false);
        toast.error("❌ Não foi possível restaurar o usuário!");
      });
  }

  async function handleRemoveUser(userId, index) {
    setActionLoading(true);

    await api
      .delete(`/api/user/${userId}`)
      .then(async (resp) => {
        await updateUser(userId, {
          trashed: true,
        });

        toast.success("✅ Usuário removido com sucesso!");
        setActionLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 409) {
          setActionLoading(false);
          return toast.error("❌ Este usuário é o logado atualmente!");
        }

        toast.error("❌ Não foi possível excluir o usuário!");
        setActionLoading(false);
      });
  }

  const handleLimit = useCallback((value) => {
    setLimit(value);
    setPage(1);
  }, []);

  return (
    <>
      <div className="text-center mb-4">
        <h1>Usuários do Sistema</h1>
      </div>

      <Link to="/user-create" className="btn btn-primary mb-3">
        <FaPlus className="mr-1" /> Novo Usuário
      </Link>

      <Table
        striped
        bordered
        responsive
        hover
        className="text-center mt-3 mb-2"
      >
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>
              {actionLoading ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                "Acesso Concedido"
              )}
            </th>
            <th>Acesso</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center">
                <Spinner animation="border" variant="primary" />
              </td>
            </tr>
          ) : (
            users.map((u, index) => (
              <tr key={index}>
                <td>
                  <>
                    {u.name}{" "}
                    {u.trashed && (
                      <Badge pill variant="danger">
                        lixeira
                      </Badge>
                    )}
                    {u.profile === "admin" && (
                      <Badge pill variant="primary">
                        admin
                      </Badge>
                    )}
                  </>
                </td>
                <td>{u.email}</td>
                <td>
                  {u.is_approved ? (
                    <h6>
                      <Badge pill variant="success">
                        Sim
                      </Badge>
                    </h6>
                  ) : (
                    <h6>
                      <Badge pill variant="danger">
                        Não
                      </Badge>
                    </h6>
                  )}
                </td>
                <td>
                  {u.is_approved ? (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDisapproved(u.id)}
                      disabled={u.profile === "admin"}
                    >
                      <FaUserAltSlash className="mr-1" /> Retirar
                    </button>
                  ) : (
                    <button
                      className="btn btn-success text-white btn-sm"
                      onClick={() => handleApproved(u.id)}
                    >
                      <FaUserCheck className="mr-1" /> Conceder
                    </button>
                  )}
                </td>
                <td>
                  {u.trashed ? (
                    <button
                      className="btn btn-secondary btn-sm"
                      type="button"
                      onClick={() => handleRestoreUser(u.id, index)}
                    >
                      <FaTrashRestore />
                    </button>
                  ) : (
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Action Area"
                    >
                      <Link
                        to={`/user-view/${u.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        <FaEye color="#fff" />
                      </Link>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveUser(u.id, index)}
                        disabled={user.id === u.id || u.profile === "admin"}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Container fluid className="p-0">
        <Row>
          <Col>
            <small className="mt-0">
              Mostrando <strong>{showTotal.from} </strong> até
              <strong> {showTotal.to}</strong> de{" "}
              <strong> {showTotal.total} </strong>
              Registros
            </small>
          </Col>
        </Row>
        <Row>
          <Col md={2} sm={12}>
            <Form.Group controlId="showTotalPerPage">
              <Form.Control
                as="select"
                custom
                disabled={
                  !!selectTotalShow.every((total) => total >= showTotal.total)
                }
                defaultValue={limit}
                onChange={(e) => handleLimit(e.target.value)}
              >
                {selectTotalShow.map((total, index) => (
                  <option
                    value={total}
                    key={index}
                    disabled={total >= showTotal.total}
                  >
                    {total}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={10} sm={12}>
            <div className="d-flex justify-content-end">
              <Pagination>
                <Pagination.First
                  onClick={() => setPage(1)}
                  disabled={isFirstPage}
                />
                <Pagination.Prev onClick={prevPage} disabled={isFirstPage} />

                {pages[0] > 1 && <Pagination.Ellipsis disabled />}

                {pages.map((p, index) => (
                  <Pagination.Item
                    key={index}
                    onClick={() => setPage(p)}
                    active={page === p}
                  >
                    {p}
                  </Pagination.Item>
                ))}

                {pages[maxVisibleButtons - 1] < showTotal.totalPages && (
                  <Pagination.Ellipsis disabled />
                )}

                <Pagination.Next onClick={nextPage} disabled={isLastPage} />
                <Pagination.Last
                  onClick={() => setPage(lastPage)}
                  disabled={isLastPage}
                />
              </Pagination>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UsersTable;
