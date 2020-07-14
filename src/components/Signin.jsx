import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { sessionState } from "../recoil/atoms";
import { OK, Error, Title } from "../style/styles";

const SIGNIN_MUTATION = gql`
  mutation signin($userName: String!, $pwd: String!) {
    signin(userName: $userName, pwd: $pwd) {
      _id
      token
    }
  }
`;

export default () => {
    const [session, setSession] = useRecoilState(sessionState);
    const [errorMessage, setErrorMessage] = useState("");
    const [signinMutation, { data }] = useMutation(SIGNIN_MUTATION, {
      onError(error) {
        setSession({
          userid: "",
          token: "",
          logged: false,
        });
        if (error.message.includes("Non existent or not authorized")) {
          console.error("Usuario o contraseña no válidos");
          setErrorMessage("Usuario o contraseña no válidos");
        } else {
          setErrorMessage(
            "Ha ocurrido un error inesperado, vuelve a intentarlo más tarde",
          );
        }
      },
    });

    const signin = (userName, pwd) => {
        signinMutation({
          variables: { userName, pwd },
        });
      };
    
      if (data) {
        if (session.token !== data.signin.token) {
          setSession({
            userid: data.signin._id,
            token: data.signin.token,
            logged: false,
          });
          setErrorMessage("");
        }
      }

      return (
        <Signin>
          <Title>Registro</Title>
          <p>Una vez registrado, inicie sesión.</p>
          {errorMessage !== "" ? <Error>{errorMessage}</Error> : null}
          {session.logged
            ? (
              <OK>Usuario creado correctamente</OK>
            )
            : (
              <Signin>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Nombre de usuario"
                >
                </Input>
                <Input id="pwd" type="password" placeholder="Contraseña"></Input>
                <Input id="pwdagain" type="password" placeholder="Contraseña"></Input>
                <Button
                  onClick={() => {
                    if(document.getElementById("pwd").value === document.getElementById("pwdagain").value){
                      signin(
                        document.getElementById("userName").value,
                        document.getElementById("pwd").value,
                      );
                    }else{
                      setErrorMessage("Contraseñas distintas!")
                    }
                    
                  }}
                >
                  Enviar
                </Button>
              </Signin>
            )}
        </Signin>
      );
    };
    
    const Signin = styled.div`
      color: #333333;
      margin: 2em;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `;
    
    const Input = styled.input`
      border: 1px solid #333;
      height: 30px;
      width: 500px;
    `;
    
    const Button = styled.button`
      color: black;
      font-weight: bold;
      height: 30px;
      width: 500px;
      border: 1px solid #333;
      &:hover {
        background-color: #bbbbbb;
        cursor: pointer;
      }
    `;