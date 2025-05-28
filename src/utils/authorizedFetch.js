import {auth} from '../config/firebase-config';

export async function authorizedFetch(url, options = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const token = await user.getIdToken();

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  let body = options.body;
  if (body && typeof body === 'object') {
    body = JSON.stringify(body);
  }

  const fetchOptions = {
    ...options,
    headers,
    body,
  };

  return fetch(url, fetchOptions);
}
