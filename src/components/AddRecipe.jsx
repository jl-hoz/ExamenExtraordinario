import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { sessionState } from "../recoil/atoms";
import { OK, Error, Title } from "../style/styles";
import UploadFile from "./UploadFile";

const ADDRECIPE_MUTATION = gql`
  mutation addRecipe($userid: ID!, $token: String!, $title: String!, $description: String!, $steps: [StepInput]!, $ingredients: [ID!]!, $mainImage: FileInput!) {
    addRecipe(userid: $userid, token: $token, title: $title, description: $description, steps: $steps, ingredients: $ingredients, mainImage: $mainImage) {
      _id
      title
      description
    }
  }
`;

export default () => {

  const [session, setSession] = useRecoilState(sessionState);
  const [addRecipeMutation, { data }] = useMutation(ADDRECIPE_MUTATION, {});

  const addRecipe = (userid, token, title, description) => {
    addRecipeMutation({
      variables: { userid, token, title, description, undefined, undefined, undefined},
    });
  };

  return (
    <div>
      <Title>Registro</Title>
      <Input id="title" type="text" placeholder="Título" />
      <Input id="description" type="text" placeholder="Descripción"></Input>
      <Input id="ingredients" type="text" placeholder="Ingredientes:"></Input>
      <Input id="steps" type="text" placeholder="Pasos"></Input>
      <Button
        onClick={() => {
          addRecipe(
            session.userid,
            session.token,
            document.getElementById("title").value,
            document.getElementById("description").value
          );
        }}
      >
        Enviar
      </Button>
      <UploadFile />
    </div>
  );
};


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


const Input = styled.input`
  border: 1px solid #333;
  height: 30px;
  width: 500px;
`;