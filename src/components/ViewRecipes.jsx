import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import styled from "styled-components";
import { OK, Error, Title } from "../style/styles";

const RECIPES_LIST_QUERY = gql`
  {
    recipes {
      _id
      title
      description
      steps{
        description
      }
      date
      ingredients{
        _id
        name
      }
      author
    }
  }
`;
export default () => {
  const { loading, error, data } = useQuery(RECIPES_LIST_QUERY);
  if (loading) return <p>Cargando lista de recetas...</p>;
  if (error) return <p>Error cargando la lista de recetas...</p>;

  return (
    <RecipesList>
      <Title>Recetas Disponibles</Title>
      {data.recipes.map(({ _id, title, description, date, ingredients, steps }) => (
        <div key={_id}>
          <h3>{title}</h3>
          <p>Publicado el {date}</p>
          <p>{description}</p>
          <h5>Lista de ingredientes:</h5>
          <ul>
            {ingredients.map(({_id, name}) => (
                <li key={_id}>{name}</li>
            ))}
          </ul>
          <h5>Pasos a seguir:</h5>
          <ol>
            {steps.map(({description}) => (
                <div>
                  <li>{description}</li>
                </div>  
            ))}
          </ol>
        </div>
      ))}
    </RecipesList>
  );
};

const RecipesList = styled.div`
  color: #333333;
  margin: 2em;
  display: flex;
  flex-direction: column;
`;

const Recipes = styled.div`
  margin-left: 1em;
`;
