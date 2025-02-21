export const setCookie = (
  name: string,
  value: string,
  maxAge: number
): void => {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; Secure; SameSite=Lax;`;
};

export const getCookie = (name: string): string | undefined => {
  const matches = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return matches ? matches[2] : undefined;
};

export const clearCookie = (name: string): void => {
  document.cookie = `${name}=; path=/; max-age=0; Secure; SameSite=Lax;`;
};
