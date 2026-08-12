// the only place that talks to fetch. service clients build on this and don't
// have to care about status codes, json parsing or error messages.
// relative paths on purpose: the page came from the gateway, so calls go out
// through the same origin and never straight to a service's internal port.

export async function get(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(await errorMessage(response, 'could not load ' + path));
  }
  return response.json();
}

export async function post(path, body) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error(await errorMessage(response, 'could not post to ' + path));
  }
  return response.json();
}

// the services put the reason in the message field; fall back to a generic one
async function errorMessage(response, fallback) {
  const body = await response.json().catch(() => ({}));
  return body.message ?? `${fallback} (${response.status})`;
}
