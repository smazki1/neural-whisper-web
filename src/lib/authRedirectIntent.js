export function detectPasswordRecoveryRedirect(url) {
  const parsedUrl = new URL(url);
  const searchParameters = parsedUrl.searchParams;
  const hashParameters = new URLSearchParams(parsedUrl.hash.slice(1));
  const redirectType = hashParameters.get("type") ?? searchParameters.get("type");
  const hasImplicitCredentials =
    hashParameters.has("access_token") && hashParameters.has("refresh_token");
  const hasCallbackError =
    hashParameters.has("error") ||
    hashParameters.has("error_code") ||
    hashParameters.has("error_description") ||
    searchParameters.has("error") ||
    searchParameters.has("error_code") ||
    searchParameters.has("error_description");

  return redirectType === "recovery" && (hasImplicitCredentials || hasCallbackError);
}

let initialPasswordRecoveryRedirect =
  typeof window !== "undefined"
    ? detectPasswordRecoveryRedirect(window.location.href)
    : false;

export function consumeInitialPasswordRecoveryRedirect() {
  const detected = initialPasswordRecoveryRedirect;
  initialPasswordRecoveryRedirect = false;
  return detected;
}
