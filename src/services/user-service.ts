// services/userService.ts
export interface User {
  userName: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface UserCreate {
  id: string;
  name: string;
  email: string;
}

class UserService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  /*************  Codeium Command ⭐  *************/
  /**
   * Creates a new user and returns the created user's data.
   * @param user - The user data to be created.
   * @param successCallback - An optional callback function that will be called with the created user's data.
   * @param errorCallback - An optional callback function that will be called with an error message if any error occurs.
   */
  async create(
    user: User,
    successCallback?: (data: UserCreate) => void,
    errorCallback?: (errorMessage: string) => void
  ): Promise<UserCreate> {
    if (!user) {
      throw new Error("User data cannot be null or undefined.");
    }

    try {
      const response = await fetch(
        `http://localhost:5129/api/Users/CreateUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json-patch+json",
          },
          body: JSON.stringify(user),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();

        let message = "";

        if (errorResponse && Array.isArray(errorResponse)) {
          errorResponse.forEach((v) => {
            if (v.value && Array.isArray(v.value)) {
              v.value.forEach((errorMessage: any) => {
                message += `${errorMessage}\n`;
              });
            }
          });
        } else if (errorResponse && errorResponse.message) {
          message = errorResponse.message;
        } else {
          message = "An unknown error occurred.";
        }

        if (errorCallback) {
          errorCallback(message.trim());
        }

        throw new Error(message.trim());
      }

      const data: UserCreate = await response.json();
      if (successCallback) {
        successCallback(data);
      }

      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (errorCallback) {
          errorCallback(error.message || "An unknown error occurred.");
        }

        throw error;
      } else {
        // Handle the case where error is not an instance of Error
        // For example, you can throw a new Error with a custom message
        throw new Error("An unknown error occurred.");
      }
    }
  }
}

export const userService = new UserService();
