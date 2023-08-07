import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
function App() {
  // Read
  const [user, setUser] = useState([]);
  const listUser = () => {
    axios
      .get(`http://localhost:8080/api/v1/users/`)
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    listUser();
  }, []);

  // Create
  const [showCreate, setShowCreate] = useState(false);

  const handleShowCreate = () => setShowCreate(true);
  const [newUser, setNewUser] = useState({
    user_name: "",
    user_description: "",
  });
  const handleCreate = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCloseCreate = (e) => {
    setShowCreate(false);
    e.preventDefault();
    axios
      .post(`http://localhost:8080/api/v1/users/`, newUser)
      .then((res) => {
        listUser();
        setShowCreate(false);
      })
      .catch((err) => console.log(err));
  };

  // Edit
  const [editUser, setEditUser] = useState({
    name: "",
    description: "",
  });
  const [showEdit, setShowEdit] = useState(false);
  const handleShowEdit = (id) => {
    const userEdit = user.find((user) => user.user_id == id);
    if (userEdit) {
      setEditUser(userEdit);
      setShowEdit(true);
    }
  };

  const handleEditUser = (e) => {
    const { name, value } = e.target;
    setEditUser({
      ...editUser,
      [name]: value,
    });
  };
  const handleCloseEdit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8080/api/v1/users/${editUser.user_id}`, editUser)
      .then((res) => {
        listUser();
      })
      .catch((err) => console.log(err));
    setShowEdit(false);
  };

  // Delete
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/v1/users/${id}`)
      .then((res) => {
        listUser();
      })
      .catch((err) => console.log(err));
  };
  //Sắp xếp
  const [userSort, setUserSort] = useState([]);
  const handleSort = () => {
    axios
      .get(`http://localhost:8080/api/v1/users/sort`)
      .then((res) => setUserSort(res.data.data[0]))
      .catch((err) => console.log(err));
  };
  return (
    <>
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>
            <Button variant="success" onClick={handleShowCreate}>
              Tạo mới
            </Button>
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={handleSort}># (Click me)</th>
            <th>Tên</th>
            <th>Mô tả</th>
            <th colSpan={2}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {(userSort.length > 0 ? userSort : user).map((user, index) => (
            <tr key={user.user_id}>
              <td>{index + 1}</td>
              <td>{user.user_name}</td>
              <td>{user.user_description}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleShowEdit(user.user_id)}
                >
                  Sửa
                </Button>
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(user.user_id)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <form>
        <Modal show={showCreate} onHide={handleCloseCreate} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Tạo mới người dùng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <label className="form-label">Tên</label>
              <input
                type="text"
                className="form-control"
                name="user_name"
                onChange={handleCreate}
              />
              <label className="form-label">Mô tả</label>
              <input
                type="text"
                className="form-control"
                name="user_description"
                onChange={handleCreate}
              />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseCreate}>
              Thêm mới
            </Button>
          </Modal.Footer>
        </Modal>
      </form>
      <form>
        <Modal show={showEdit} onHide={() => setShowEdit(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Sửa thông tin người dùng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <label className="form-label">Tên</label>
              <input
                type="text"
                className="form-control"
                name="user_name"
                value={editUser.user_name}
                onChange={handleEditUser}
              />
              <label className="form-label">Mô tả</label>
              <input
                type="text"
                className="form-control"
                name="user_description"
                value={editUser.user_description}
                onChange={handleEditUser}
              />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseEdit}>
              Lưu thay đổi
            </Button>
          </Modal.Footer>
        </Modal>
      </form>
    </>
  );
}

export default App;
