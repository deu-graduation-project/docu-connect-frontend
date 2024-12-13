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

  async create(
    user: User,
    successCallback?: (data: UserCreate) => void,
    errorCallback?: (errorMessage: string) => void
  ): Promise<UserCreate> {
    try {
      const response = await fetch(`${this.baseUrl}/users/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        let message = "";

        if (Array.isArray(errorResponse)) {
          errorResponse.forEach((v) => {
            if (Array.isArray(v.value)) {
              v.value.forEach((errorMessage: any) => {
                message += `${errorMessage}\n`;
              });
            }
          });
        } else {
          message = errorResponse.message || "An unknown error occurred.";
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
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService();
