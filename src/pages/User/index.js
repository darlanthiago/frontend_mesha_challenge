import { Container } from "react-bootstrap";
import UsersTable from "../../components/UsersTable";

function User() {
  return (
    <Container fluid>
      <UsersTable url={`/api/user`} />
    </Container>
  );
}

export default User;
