import { fetchWithAuth } from "@/services/fetch-with-auth"
import { setCookie } from "@/services/cookies"
import {
  TokenResponse,
  SocialUser,
  VerifyResetTokenResponse,
} from "@/types/classes"

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
      )

      if (!response.ok) {
        // Try to parse the error response as JSON
        let errorResponse
        try {
          errorResponse = await response.json()
        } catch (e) {
          // If the response is not JSON, use the raw text
          errorResponse = await response.text()
        }

        // Throw a meaningful error message
        const errorMessage =
          errorResponse.message || errorResponse || "Login failed."
        throw new Error(errorMessage)
      }

      const tokenResponse: TokenResponse = await response.json()

      if (tokenResponse) {
        setCookie("accessToken", tokenResponse.token.accessToken, 3600) // 1 hour
        setCookie("refreshToken", tokenResponse.token.refreshToken, 604800) // 7 days
      }

      return tokenResponse
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

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
        throw new Error("Token refresh failed")
      }

      const tokenResponse: TokenResponse = await response.json()

      if (tokenResponse) {
        setCookie("accessToken", tokenResponse.token.accessToken, 3600) // 1 hour
        setCookie("refreshToken", tokenResponse.token.refreshToken, 604800) // 7 days
      }

      return tokenResponse
    } catch (error) {
      console.error("Token refresh error:", error)
      throw error
    }
  }

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
        throw new Error("Google login failed")
      }

      const tokenResponse: TokenResponse = await response.json()

      if (tokenResponse) {
        setCookie("accessToken", tokenResponse.token.accessToken, 3600) // 1 hour
        setCookie("refreshToken", tokenResponse.token.refreshToken, 604800) // 7 days
      }

      return tokenResponse
    } catch (error) {
      console.error("Google login error:", error)
      throw error
    }
  }

  /**
   * Initiates the password reset process for a user.
   * Sends the user's email or username to the backend.
   * The backend is expected to handle sending the reset link/code.
   * @param emailOrUserName - The email or username of the user requesting password reset.
   * @returns A promise that resolves when the request is successfully sent (void), or rejects on error.
   */
  const passwordReset = async (emailOrUserName: string): Promise<void> => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/Auth/PasswordReset`, // Endpoint from your backend description
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Body structure matches PasswordResetCommandRequest
          body: JSON.stringify({ emailOrUserName }),
        }
      )

      if (!response.ok) {
        // Handle potential errors from the backend
        let errorResponse
        try {
          // Attempt to parse potential JSON error response
          errorResponse = await response.json()
        } catch (e) {
          // If not JSON, use the response text
          errorResponse = await response.text()
        }

        // Construct a meaningful error message
        const errorMessage =
          errorResponse?.message || // Check for a 'message' field in JSON error
          (typeof errorResponse === "string" ? errorResponse : null) || // Use text if available
          `Password reset request failed with status: ${response.status}` // Fallback
        throw new Error(errorMessage)
      }

      // If response.ok is true, the request was successful.
      // Since the backend PasswordResetCommandResponse is empty,
      // there's no JSON body to parse or return here.
      console.log(
        `Password reset request sent successfully for: ${emailOrUserName}`
      )
    } catch (error) {
      console.error("Password reset request error:", error)
      // Re-throw the error so the calling component (e.g., a form)
      // can catch it and display feedback to the user.
      throw error
    }
  }

  /**
   * Verifies a password reset token against a user ID.
   * @param resetToken - The password reset token (likely from the URL or email link).
   * @param userId - The ID of the user associated with the token.
   * @returns A promise that resolves to an object { state: boolean } indicating if the token is valid, or rejects on error.
   */
  const verifyResetToken = async (
    resetToken: string,
    userId: string
  ): Promise<VerifyResetTokenResponse> => {
    // Use the defined interface
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/VerifyResetToken`, // Endpoint from backend description
        {
          method: "POST", // Assuming POST based on having a request body
          headers: {
            "Content-Type": "application/json",
          },
          // Body structure matches the provided JSON example
          // Note: Using camelCase as shown in the JSON example, which is common
          //       even if C# properties are PascalCase (due to serializer settings)
          body: JSON.stringify({ resetToken, userId }),
        }
      )

      if (!response.ok) {
        // Handle potential errors
        let errorResponse
        try {
          errorResponse = await response.json()
        } catch (e) {
          errorResponse = await response.text()
        }
        const errorMessage =
          errorResponse?.message ||
          (typeof errorResponse === "string" ? errorResponse : null) ||
          `Token verification failed with status: ${response.status}`
        throw new Error(errorMessage)
      }

      // Parse the JSON response which should contain the 'state' boolean
      const result: VerifyResetTokenResponse = await response.json()

      // Optional runtime check for the expected property
      if (typeof result?.state !== "boolean") {
        console.warn(
          "VerifyResetToken response received, but 'state' property is missing or not a boolean:",
          result
        )
        // Depending on requirements, you might throw an error or return a default state
        throw new Error(
          "Invalid response format from token verification endpoint."
        )
        // Or: return { state: false }; // If you prefer to treat invalid responses as verification failure
      }

      return result // Return the object like { state: true } or { state: false }
    } catch (error) {
      console.error("Verify reset token error:", error)
      // Re-throw for the calling component to handle
      throw error
    }
  }

  /**
   * Updates a user's password after reset.
   * @param userId - The ID of the user.
   * @param resetToken - The reset token for validation.
   * @param password - The new password.
   * @param passwordConfirm - Confirmation of the new password.
   * @returns A promise that resolves when the password is successfully updated.
   */
  const updatePassword = async (
    userId: string,
    resetToken: string,
    password: string,
    passwordConfirm: string
  ): Promise<void> => {
    try {
      // Check if password and passwordConfirm match
      if (password !== passwordConfirm) {
        throw new Error("Password and password confirmation do not match.")
      }

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Users/UpdatePassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            resetToken,
            password,
            passwordConfirm,
          }),
        }
      )

      if (!response.ok) {
        // Try to parse the error response as JSON
        let errorResponse
        try {
          errorResponse = await response.json()
        } catch (e) {
          // If the response is not JSON, use the raw text
          errorResponse = await response.text()
        }

        // Throw a meaningful error message
        const errorMessage =
          errorResponse.message ||
          errorResponse ||
          `Password update failed with status: ${response.status}`
        throw new Error(errorMessage)
      }

      // If successful, there's no data to return based on the C# endpoint
      console.log("Password successfully updated")
    } catch (error) {
      console.error("Password update error:", error)
      throw error
    }
  }

  return {
    login,
    refreshTokenLogin,
    googleLogin,
    passwordReset,
    verifyResetToken,
    updatePassword,
  }
}
