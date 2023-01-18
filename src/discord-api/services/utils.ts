import { AccessToken } from 'simple-oauth2';

export const UserRequestOptions = (tokenDetails: AccessToken) => {
  return {
    auth: false,
    headers: {
      Authorization: `Bearer ${tokenDetails.token.access_token}`,
    },
  };
};
