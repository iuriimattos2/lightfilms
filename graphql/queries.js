import { gql } from "@apollo/client";

export const GET_ALL_FILMS = gql`
  query getAllFilms {
    getAllFilms {
      id
      title
      producedBy
      coverIMG
      countries
      genres
      year
    }
  }
`;

export const GET_PRODUCERS = gql`
  query getProducers {
    getProducers {
      id
      name
      title
      type
      imgs
      countries
      yearsPopular
    }
  }
`;

export const GET_ACTERS = gql`
  query getActers {
    getActers {
      id
      name
      title
      type
      imgs
      countries
      yearsPopular
    }
  }
`;
