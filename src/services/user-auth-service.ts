import { fetchWithAuth } from "@/services/fetch-with-auth";
import { setCookie } from "@/services/cookies";
import { TokenResponse, SocialUser } from "@/types/classes";

export const UserAuthService = () => {
  /**
   * Logs in a user with their username/email and password.
   * @param userNameOrEmail - The username or email of the user.
   * @param password - The user's password.
   * @returns A promise that resolves to the token response.
   */
  const login = async (
    userNameOrEmail: string,
    password: string
  ): Promise<TokenResponse> => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/Auth/Login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userNameOrEmail, password }),
        }
      );

      if (!response.ok) {
        // Try to parse the error response as JSON
        let errorResponse;
        try {
          errorResponse = await response.json();
        } catch (e) {
          // If the response is not JSON, use the raw text
          errorResponse = await response.text();
        }

        // Throw a meaningful error message
        const errorMessage =
          errorResponse.message || errorResponse || "Login failed.";
        throw new Error(errorMessage);
      }

      const tokenResponse: TokenResponse = await response.json();

      if (tokenResponse) {
        setCookie("accessToken", tokenResponse.token.accessToken, 3600); // 1 hour
        setCookie("refreshToken", tokenResponse.token.refreshToken, 604800); // 7 days
      }

      return tokenResponse;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  /**
   * Refreshes the access token using the refresh token.
   * @param refreshToken - The refresh token.
   * @returns A promise that resolves to the new token response.
   */
  const refreshTokenLogin = async (
    refreshToken: string
  ): Promise<TokenResponse> => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/RefreshTokenLogin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      )

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const tokenResponse: TokenResponse = await response.json();

      if (tokenResponse) {
        setCookie("accessToken", tokenResponse.token.accessToken, 3600); // 1 hour
        setCookie("refreshToken", tokenResponse.token.refreshToken, 604800); // 7 days
      }

      return tokenResponse;
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  };

  /**
   * Logs in a user using Google authentication.
   * @param user - The user's social login data.
   * @returns A promise that resolves to the token response.
   */
  const googleLogin = async (user: SocialUser): Promise<TokenResponse> => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/GoogleLogin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      )

      if (!response.ok) {
        throw new Error("Google login failed");
      }

      const tokenResponse: TokenResponse = await response.json();

      if (tokenResponse) {
        setCookie("accessToken", tokenResponse.token.accessToken, 3600); // 1 hour
        setCookie("refreshToken", tokenResponse.token.refreshToken, 604800); // 7 days
      }

      return tokenResponse;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  return {
    login,
    refreshTokenLogin,
    googleLogin,
  };
};
