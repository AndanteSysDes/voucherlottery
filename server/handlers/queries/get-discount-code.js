import "isomorphic-fetch";
import gql from 'graphql-tag';

const GET_DISCOUNT_CODE = gql`
    query{
      priceRules (first: $number) {
        edges {
          node {
            id
            discountCodes(first: $number) {
              edges {
                node {
                  id
                  code
                }
              }
            }
          }
        }
      }
    }
  `;

export default GET_DISCOUNT_CODE;
