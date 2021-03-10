import "isomorphic-fetch";
import gql from 'graphql-tag';

// const CHECK_DISCOUNT_CODE = gql`
//   query{
//     codeDiscountNodeByCode(code: $code) {
//       id
//     }
//   }
//   `;
// 
// export default CHECK_DISCOUNT_CODE;

export default function CHECK_DISCOUNT_CODE(code) {
    return gql`
    query{
      codeDiscountNodeByCode(code: ${code}) {
        id
      }
    }
    `;
  }
