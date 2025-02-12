// services/userService.ts

import { Address, GetAgencies, GetBeAnAgencyRequests, GetSingleAgency, User, UserCreate } from "@/types/classes";
import { fetchWithAuth } from "./fetch-with-auth";
import { SucceededMessageResponse } from "@/types";


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
    profilePhoto?: File, // Profil fotoğrafı desteği eklendi
    agencyBio?: string,
    successCallback?: () => void,
    errorCallback?: (errorMessage: string) => void
  ) {
    try {
      const formData = new FormData();
      formData.append("UserName", userName);
      formData.append("Name", name);
      formData.append("Surname", surname);
      formData.append("Email", email);
      formData.append("Password", password);
      formData.append("PasswordConfirm", passwordConfirm);
      formData.append("AgencyName", agencyName);
      formData.append("Address", JSON.stringify(address));
      if (agencyBio) formData.append("AgencyBio", agencyBio);
      if (profilePhoto) formData.append("ProfilePhoto", profilePhoto); 

      const response = await fetchWithAuth(`${this.baseUrl}/Users/BeAnAgency`, {
        method: "POST",
        body: formData, // JSON yerine FormData kullanılıyor
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

      return response.json(); // JSON formatında döndür
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
  async assignRolesToUser(userId: string, roles: string[]) {
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
  async updateAgencyInfos(data: {
    name?: string;
    surname?: string;
    agencyName?: string;
    province?: string;
    district?: string;
    extra?: string;
    agencyBio?: string;
    profilePhoto?: File;
  }): Promise<SucceededMessageResponse> {
    const formData = new FormData();
    if (data.name) formData.append("Name", data.name);
    if (data.surname) formData.append("Surname", data.surname);
    if (data.agencyName) formData.append("AgencyName", data.agencyName);
    if (data.province) formData.append("Province", data.province);
    if (data.district) formData.append("District", data.district);
    if (data.extra) formData.append("Extra", data.extra);
    if (data.agencyBio) formData.append("AgencyBio", data.agencyBio);
    if (data.profilePhoto) formData.append("ProfilePhoto", data.profilePhoto);

    const response = await fetchWithAuth(
      `${this.baseUrl}/Users/UpdateAgencyInfos`,
      {
        method: "PUT",
        body: formData,
      }
    );
    return response.json() as Promise<SucceededMessageResponse>;
  }
}

export const userService = new UserService();
