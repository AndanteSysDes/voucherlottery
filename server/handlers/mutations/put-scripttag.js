
import "isomorphic-fetch";
import gql from 'graphql-tag';

export default function PUT_SCRIPT_TAG(URL) {

  const variables ={
    input: {
      displayScope: "ONLINE_STORE",
      src: URL,
    }
  };

    return gql`
    mutation scriptTagCreate(${variables}: ScriptTagInput!) {
      scriptTagCreate(input: ${variables}) {
        scriptTag {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
    `;
  }
