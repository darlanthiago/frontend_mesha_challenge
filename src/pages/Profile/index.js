import { useCallback, useEffect, useState } from "react";
import { Container, Figure, Form, Image } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { FiTrash2 } from "react-icons/fi";

import { isEmptyObject } from "../../utils/checkObject";

import { useReactAuth } from "../../contexts/hooks/AuthContext";

import "./styles.css";
import SubmitButtonApp from "../../components/SubmitButton/app";
import { FaSave } from "react-icons/fa";
import api from "../../services/api";

function Profile() {
  const { user, setUser } = useReactAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(
    () => () => {
      files.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
    },
    [files]
  );

  const thumbsContainer = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  };

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 2,
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file, index) => (
    <Figure key={index}>
      <Figure.Image
        width={150}
        height={180}
        alt={file.name}
        src={file.preview}
        rounded
      />
      <Figure.Caption>{file.name}</Figure.Caption>
      <button
        className="clean-preview"
        onClick={() => {
          setFiles([]);
        }}
      >
        <FiTrash2 size={20} color="#f6261c" />
      </button>
    </Figure>
  ));

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const formData = new FormData();

      formData.append("avatar_image", files[0]);

      setLoading(true);

      await api
        .post("/api/user/avatar", formData)
        .then((resp) => {
          setUser(resp.data);
          setFiles([]);
          setLoading(false);
        })
        .catch((error) => {
          setUser(user);
          setLoading(false);
        });
    },
    [files, setUser, user]
  );

  return (
    <>
      <div className="text-center">
        <h1 className="mb-5">Perfil de Usuário</h1>
      </div>

      <Container className="d-flex justify-content-center">
        <Form onSubmit={onSubmit} encType="multipart/form-data" method="POST">
          <Form.Row>
            <div className="text-center">
              <div {...getRootProps({ className: "dropzone" })}>
                {isEmptyObject(files) ? (
                  <>
                    <input
                      {...getInputProps()}
                      id="upload-button"
                      name="avatar_image"
                      accept="image/png,image/jpg,image/jpeg"
                      required
                    />
                    <h5 className="text-center button-upload">
                      <div className="d-flex flex-column bd-highlight">
                        <Image src={user.avatar_url} rounded height="300" />
                        Clique para alterar a imagem
                      </div>
                    </h5>
                  </>
                ) : (
                  <aside style={thumbsContainer}>{thumbs}</aside>
                )}
              </div>
            </div>
          </Form.Row>

          <SubmitButtonApp
            color="primary"
            disabled={isEmptyObject(files)}
            isBlock={true}
            loading={loading}
          >
            <FaSave className="mr-2" />
            Salvar
          </SubmitButtonApp>
        </Form>
      </Container>
    </>
  );
}

export default Profile;
