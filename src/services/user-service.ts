// services/userService.ts

import { Address, GetAgencies, GetBeAnAgencyRequests, GetSingleAgency, User, UserCreate } from "@/types/classes";
import { fetchWithAuth } from "./fetch-with-auth";


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
  async createUser(
    user: User,
    successCallback?: (data: UserCreate) => void,
    errorCallback?: (errorMessage: string) => void
  ): Promise<UserCreate> {
    if (!user) {
      throw new Error("User data cannot be null or undefined.");
    }

    try {
      const response = await fetch(`${this.baseUrl}/Users/CreateUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json-patch+json",
        },
        body: JSON.stringify(user),
      });

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
  async beAnAgency(
    userName: string,
    name: string,
    surname: string,
    email: string,
    password: string,
    passwordConfirm: string,
    agencyName: string,
    address: Address,
    agencyBio?: string,
    successCallback?: () => void,
    errorCallback?: (errorMessage: string) => void
  ) {
    try {
      const response = await fetch(`${this.baseUrl}/Users/BeAnAgency`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json-patch+json",
        },
        body: JSON.stringify({
          userName,
          name,
          surname,
          email,
          password,
          passwordConfirm,
          agencyName,
          address,
          agencyBio,
        }),
      });

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
          message = "Bilinmeyen bir hata oluştu.";
        }

        if (errorCallback) {
          errorCallback(message.trim());
        }

        throw new Error(message.trim());
      }

      if (successCallback) {
        successCallback();
      }

      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (errorCallback) {
          errorCallback(error.message || "Bilinmeyen bir hata oluştu.");
        }

        throw error;
      } else {
        throw new Error("Bilinmeyen bir hata oluştu.");
      }
    }
  }
  async beAnAgencyConfirm(BeAnAgencyRequestId: string, IsConfirmed: boolean) {
    const response = await fetchWithAuth(
      `${this.baseUrl}/Users/BeAnAgencyConfirm`,
      {
        method: "POST",
        body: JSON.stringify({
          BeAnAgencyRequestId,
          IsConfirmed,
        }),
      }
    );
    return response;
  }
  async getBeAnAgencyRequests(
    page: number,
    size: number,
    orderBy?: string,
    usernameOrEmail?: string,
    requestId?: string,
    state?: string
  ): Promise<{
    totalCount: number;
    BeAnAgencyRequests: GetBeAnAgencyRequests[];
  }> {
    const queryParams: any = {
      page: page.toString(),
      size: size.toString(),
    };

    if (orderBy) queryParams.orderBy = orderBy;
    if (usernameOrEmail) queryParams.usernameOrEmail = usernameOrEmail;
    if (requestId) queryParams.requestId = requestId;
    if (state) queryParams.state = state;

    const queryString = new URLSearchParams(queryParams).toString();
    const data = await fetchWithAuth(
      `${this.baseUrl}/Users/GetBeAnAgencyRequests?${queryString}`,
      {
        method: "GET",
      }
    );
    return data;
  }
  async getAgencies(
    page: number,
    size: number,
    agencyName?: string,
    province?: string,
    district?: string,
    orderBy?: string
  ): Promise<{
    totalCount: number;
    BeAnAgencyRequests: GetAgencies[];
  }> {
    const queryParams: any = {
      page: page.toString(),
      size: size.toString(),
    };

    if (agencyName) queryParams.agencyName = agencyName;
    if (province) queryParams.province = province;
    if (district) queryParams.district = district;
    if (orderBy) queryParams.orderBy = orderBy;

    const queryString = new URLSearchParams(queryParams).toString();

    const data = await fetchWithAuth(
      `${this.baseUrl}/Users/GetAgencies?${queryString}`,
      {
        method: "GET",
      }
    );
    return data;
  }
  async getSingleAgency(agencyId: string): Promise<GetSingleAgency> {
    const queryParams: any = {
      agencyId: agencyId,
    };
    const queryString = new URLSearchParams(queryParams).toString();
    const data = await fetchWithAuth(
      `${this.baseUrl}/Users/GetAgencies?${queryString}`,
      {
        method: "GET",
      }
    );
    return data;
  }
  async assignRolesToUser(userId:string,roles:string[]){
    const response = await fetchWithAuth(
      `${this.baseUrl}/Users/AssignRolesToUser`,
      {
        method: "POST",
        body: JSON.stringify({
          userId,
          roles,
        }),
      }
    );
    return response;
  }
}

export const userService = new UserService();
