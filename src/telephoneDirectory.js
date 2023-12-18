import React, { useState, useEffect, Fragment } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./TelephoneDirectory.css";
import { useNavigate } from "react-router-dom";

const TelephoneDirectory = ({ itemsPerPage }) => {
  const [data, setData] = useState([]);
  const apiUrl = "https://localhost:7257/";
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  // Güncelleme
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [editId, setEditId] = useState(0);
  const [editName, setEditName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");

  // Ekleme
  const [addShow, setAddShow] = useState(false);
  const handleAddShow = () => setAddShow(true);
  const handleAddClose = () => setAddShow(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Filtreleme
  const [recordData, setRecordData] = useState([]);

  // Sayfalama
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = recordData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(data.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);
  // Bootstrap validation

  useEffect(() => {
    if (localStorage.getItem("userToken") === null) {
      navigate("/");
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl + "api/TelephoneDirectories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const result = await response.json();
      setData(result);
      setRecordData(result);
    } catch (error) {
      alert("Data bulunamadı");
    }
  };

  const handleUpdate = () => {
    if (editName === "" || editLastName === "" || editPhoneNumber === "") {
      toast.warning("Tüm alanları doldurunuz");
    } else {
      const postData = {
        id: editId,
        name: editName,
        lastName: editLastName,
        phoneNumber: editPhoneNumber,
      };

      fetch(apiUrl + "api/TelephoneDirectories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(postData),
      }).then((responseData) => {
        if (responseData.status === 200) {
          fetchData();
          clear();
          handleClose();
          toast.success("Rehbere başarıyla Güncellendi.");
        } else {
          toast.error("Bir sorun ile karşılaşıldı.");
        }
      });
    }
  };

  const handleEdit = (id, name, lastName, phoneNumber) => {
    // API'den veri güncelleme işlemi
    handleShow();
    setEditId(id);
    setEditName(name);
    setEditLastName(lastName);
    setEditPhoneNumber(phoneNumber);
  };

  const handleDelete = (id, phoneNumber) => {
    // API'den veri silme işlemi
    if (
      window.confirm(
        phoneNumber + " Numarayı silmek istediğinize emin misiniz ?"
      ) == true
    ) {
      fetch(apiUrl + "api/TelephoneDirectories/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }).then((responseData) => {
        if (responseData.status === 200) {
          fetchData();
          toast.success("Rehberden başarıyla Silindi.");
        } else {
          toast.error("Bir sorun ile karşılaşıldı.");
        }
      });
    }
  };

  const handleAdd = () => {
    if (name === "" || lastName === "" || phoneNumber === "") {
      toast.warning("Tüm alanları doldurunuz");
    } else {
      const postData = {
        name: name,
        lastName: lastName,
        phoneNumber: phoneNumber,
      };

      fetch(apiUrl + "api/TelephoneDirectories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(postData),
      })
        .then((response) => response.json())
        .then((responseData) => {
          fetchData();
          clear();
          handleAddClose();
          toast.success("Rehbere başarıyla eklendi.");
        })

        .catch((error) => console.error("Ekleme başarısız"));
    }
  };
  const clear = () => {
    setName("");
    setLastName("");
    setPhoneNumber("");
    setEditId("");
    setEditName("");
    setEditLastName("");
    setEditPhoneNumber("");
  };

  const Filter = (event) => {
    setRecordData(
      data.filter((f) => f.name.toLowerCase().includes(event.target.value))
    );
  };

  return (
    <Fragment>
      <ToastContainer />
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <div>
            <button className="btn btn-success" onClick={() => handleAddShow()}>
              Ekle
            </button>
            <input
              type="text"
              className="search-input form-control"
              onChange={Filter}
              placeholder="Search"
            />

            <table className="table">
              <thead>
                <tr className="ssd">
                  <th>#</th>
                  <th>Name LastName</th>
                  <th>Phone Number</th>
                  <th>Created Date</th>
                  <th>Created User</th>
                  <th>Updated Date</th>
                  <th>Updated User</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{`${item.name} ${item.lastName}`}</td>
                    <td>{`+90(${item.phoneNumber.slice(
                      0,
                      3
                    )})-${item.phoneNumber.slice(
                      3,
                      6
                    )}-${item.phoneNumber.slice(6, 8)}-${item.phoneNumber.slice(
                      8,
                      10
                    )} `}</td>
                    <td>{item.createdDate}</td>
                    <td>{item.createdUser}</td>
                    <td>{item.updatedDate}</td>
                    <td>{item.updatedUser}</td>
                    <td colSpan={2}>
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          handleEdit(
                            item.id,
                            item.name,
                            item.lastName,
                            item.phoneNumber
                          )
                        }
                      >
                        Edit
                      </button>{" "}
                      &nbsp;
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item.id, item.phoneNumber)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Sayfalama İŞLEMİ */}
            <nav>
              <ul className="pagination">
                <li className="page-item">
                  <a href="#" className="page-link" onClick={prePage}>
                    Prev
                  </a>
                </li>
                {numbers.map((n, i) => (
                  <li
                    className={`page-item ${currentPage === n ? "active" : ""}`}
                    key={i}
                  >
                    <a
                      href="#"
                      className="page-link"
                      onClick={() => changeCPage(n)}
                    >
                      {n}
                    </a>
                  </li>
                ))}
                <li className="page-item">
                  <a href="#" className="page-link" onClick={nextPage}>
                    Next
                  </a>
                </li>
              </ul>
            </nav>

            {/* GÜNCELLEME İŞLEMİ */}
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Güncelleme İşlemi</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Container>
                  <Row>
                    <Col>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="İsim"
                        value={editName}
                        onChange={(x) => setEditName(x.target.value)}
                      />
                    </Col>
                    <Col>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Soyadı"
                        value={editLastName}
                        onChange={(x) => setEditLastName(x.target.value)}
                      />
                    </Col>
                    <Col>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Telefon (555 ...)"
                        value={editPhoneNumber}
                        onChange={(x) => setEditPhoneNumber(x.target.value)}
                        maxLength={10}
                      />
                    </Col>
                  </Row>
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  İptal
                </Button>
                <Button variant="primary" onClick={handleUpdate}>
                  Kaydet
                </Button>
              </Modal.Footer>
            </Modal>

            {/* EKLEME İŞLEMİ */}
            <Modal show={addShow} onHide={handleAddClose}>
              <Modal.Header closeButton>
                <Modal.Title>Ekleme İşlemi</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Container>
                  <Row>
                    <Col>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="İsim"
                        value={name}
                        onChange={(x) => setName(x.target.value)}
                      />
                    </Col>
                    <Col>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Soyadı"
                        value={lastName}
                        onChange={(x) => setLastName(x.target.value)}
                      />
                    </Col>
                    <Col>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Telefon (555 ...)"
                        value={phoneNumber}
                        onChange={(x) => setPhoneNumber(x.target.value)}
                        maxLength={10}
                      />
                    </Col>
                  </Row>
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleAddClose}>
                  İptal
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={() => handleAdd()}
                >
                  Ekle
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </Fragment>
  );

  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCPage(id) {
    setCurrentPage(id);
  }
};

export default TelephoneDirectory;
