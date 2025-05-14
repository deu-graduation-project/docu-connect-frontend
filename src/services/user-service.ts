import {
  Address,
  GetAgencies,
  GetBeAnAgencyRequests,
  GetSingleAgency,
  User,
  UserCreate,
  SucceededMessageResponse,
  GetUserByIdResponse,
} from "@/types/classes"
import { fetchWithAuth } from "./fetch-with-auth"

class UserService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
  }

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
      throw new Error("User data cannot be null or undefined.")
    }

    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Users/CreateUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json-patch+json",
        },
        body: JSON.stringify(user),
      })

      console.log("Response:", response) // Log the response object
      console.log("Response status:", response.status) // Log the status code
      console.log("Response headers:", response.headers) // Log the headers

      if (!response.ok) {
        let errorResponse
        try {
          errorResponse = await response.json() // Parse JSON for error responses
        } catch (e) {
          throw new Error("Failed to create user.")
        }
        console.error("Error response:", errorResponse) // Log the error response
        throw new Error(errorResponse.message || "Failed to create user.")
      }

      const data: UserCreate = await response.json() // Parse JSON for success responses
      if (successCallback) successCallback(data)
      return data
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred."
      if (errorCallback) errorCallback(errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Submits a request to become an agency.
   * @param userData - User and agency details.
   * @param successCallback - An optional callback function that will be called on success.
   * @param errorCallback - An optional callback function that will be called with an error message if any error occurs.
   */
  async beAnAgency(
    userName: string,
    name: string,
    surname: string,
    email: string,
    password: string,
    passwordConfirm: string,
    agencyName: string,
    address: Address,
    profilePhoto?: File,
    agencyBio?: string,
    successCallback?: () => void,
    errorCallback?: (errorMessage: string) => void
  ): Promise<any> {
    try {
      const formData = new FormData()
      formData.append("UserName", userName)
      formData.append("Name", name)
      formData.append("Surname", surname)
      formData.append("Email", email)
      formData.append("Password", password)
      formData.append("PasswordConfirm", passwordConfirm)
      formData.append("AgencyName", agencyName)

      // Initialize address object if it's null
      const addressData = address || { province: "", district: "", extra: "" }

      formData.append("Address.Province", addressData.province || "")
      formData.append("Address.District", addressData.district || "")
      formData.append("Address.Extra", addressData.extra || "")

      if (agencyBio) formData.append("AgencyBio", agencyBio)
      if (profilePhoto) formData.append("ProfilePhoto", profilePhoto)

      // Fix Content-Type handling for FormData
      const response = await fetch(`${this.baseUrl}/Users/BeAnAgency`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        let errorMessage = "API request failed."

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          errorMessage =
            errorData.message || errorData.title || JSON.stringify(errorData)
        } else {
          errorMessage = await response.text()
        }

        if (errorCallback) errorCallback(errorMessage)
        throw new Error(errorMessage)
      }

      const responseData = await response.json()
      if (successCallback) successCallback()
      return responseData
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred."
      if (errorCallback) errorCallback(errorMessage)
      throw new Error(errorMessage)
    }
  }
  /**
   * Fetches "Be an Agency" requests.
   * @param page - The page number.
   * @param size - The number of items per page.
   * @param orderBy - Optional sorting criteria.
   * @param usernameOrEmail - Optional filter by username or email.
   * @param requestId - Optional filter by request ID.
   * @param state - Optional filter by request state.
   */
  async getBeAnAgencyRequests(
    page: number,
    size: number,
    orderBy?: string,
    usernameOrEmail?: string,
    requestId?: string,
    state?: string
  ): Promise<{
    totalCount: number
    beAnAgencyRequests: GetBeAnAgencyRequests[] // Note the lowercase 'b'
  }> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(orderBy && { orderBy }),
      ...(usernameOrEmail && { usernameOrEmail }),
      ...(requestId && { requestId }),
      ...(state && { state }),
    })

    const response = await fetchWithAuth(
      `${this.baseUrl}/Users/GetBeAnAgencyRequests?${queryParams}`,
      { method: "GET" }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch agency requests")
    }

    const data = await response.json()

    // Ensure the response has the expected structure
    if (!data || !Array.isArray(data.beAnAgencyRequests)) {
      throw new Error("Invalid response format")
    }

    return data
  }

  /**
   * Approves or rejects a "Be an Agency" request.
   * @param BeAnAgencyRequestId - The ID of the request.
   * @param IsConfirmed - Whether to approve or reject the request.
   */

  async beAnAgencyConfirm(
    BeAnAgencyRequestId: string,
    IsConfirmed: boolean
  ): Promise<any> {
    const response = await fetchWithAuth(
      `${this.baseUrl}/Users/BeAnAgencyConfirm`,
      {
        method: "POST",
        body: JSON.stringify({ BeAnAgencyRequestId, IsConfirmed }),
      }
    )
    return response
  }

  /**
   * Fetches a list of agencies.
   * @param page - The page number.
   * @param size - The number of items per page.
   * @param agencyName - Optional filter by agency name.
   * @param province - Optional filter by province.
   * @param district - Optional filter by district.
   * @param orderBy - Optional sorting criteria.
   */
  async getAgencies(
    page: number,
    size: number,
    agencyName?: string,
    province?: string,
    district?: string,
    orderBy?: string,
    paperType?: string,
    colorOption?: string,
    printType?: string
  ): Promise<{ totalCount: number; agencies: GetAgencies[] }> {
    // Changed BeAnAgencyRequests to agencies
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(agencyName && { agencyName }),
      ...(province && { province }),
      ...(district && { district }),
      ...(orderBy && { orderBy }),
      ...(paperType && { paperType }),
      ...(colorOption && { colorOption }),
      ...(printType && { printType }),
    })

    const response = await fetchWithAuth(
      `${this.baseUrl}/Users/GetAgencies?${queryParams}`,
      { method: "GET" }
    )
    const data = await response.json()
    return data
  }

  /**
   * Fetches details of a single agency.
   * @param agencyId - The ID of the agency.
   */
  async getSingleAgency(agencyId: string): Promise<GetSingleAgency> {
    const queryParams = new URLSearchParams({ agencyId })
    const response = await fetchWithAuth(
      `${this.baseUrl}/Users/GetSingleAgency?${queryParams}`,
      { method: "GET" }
    )
    const data: GetSingleAgency = await response.json()
    return data
  }

  /**
   * Assigns roles to a user.
   * @param userId - The ID of the user.
   * @param roles - The roles to assign.
   */
  async assignRolesToUser(userId: string, roles: string[]): Promise<any> {
    const response = await fetchWithAuth(
      `${this.baseUrl}/Users/AssignRolesToUser`,
      {
        method: "POST",
        body: JSON.stringify({ userId, roles }),
      }
    )
    return response
  }

  /**
   * Updates agency information.
   * @param data - The updated agency details.
   */
  async updateAgencyInfos(data: {
    name?: string
    surname?: string
    agencyName?: string
    province?: string
    district?: string
    extra?: string
    agencyBio?: string
    profilePhoto?: File
  }): Promise<SucceededMessageResponse> {
    const formData = new FormData()
    if (data.name) formData.append("Name", data.name)
    if (data.surname) formData.append("Surname", data.surname)
    if (data.agencyName) formData.append("AgencyName", data.agencyName)
    if (data.province) formData.append("Province", data.province)
    if (data.district) formData.append("District", data.district)
    if (data.extra) formData.append("Extra", data.extra)
    if (data.agencyBio) formData.append("AgencyBio", data.agencyBio)
    if (data.profilePhoto) formData.append("ProfilePhoto", data.profilePhoto)

    const response = await fetchWithAuth(
      `${this.baseUrl}/Users/UpdateAgencyInfos`,
      {
        method: "PUT",
        body: formData,
      }
    )
    return response.json() as Promise<SucceededMessageResponse>
  }

  /**
   * Parses error responses from the API.
   * @param errorResponse - The error response object.
   */
  private parseErrorResponse(errorResponse: any): string {
    if (Array.isArray(errorResponse)) {
      return errorResponse
        .map((v) =>
          v.value && Array.isArray(v.value) ? v.value.join("\n") : ""
        )
        .join("\n")
        .trim()
    } else if (errorResponse?.message) {
      return errorResponse.message
    } else {
      return "An unknown error occurred."
    }
  }
  async getUserById(userId?: string): Promise<GetUserByIdResponse> {
    const queryParams = new URLSearchParams()
    if (userId) {
      queryParams.append("UserId", userId)
    }
    const response = await fetchWithAuth(
      `${this.baseUrl}/Users/GetUserById?${queryParams}`,
      { method: "GET" }
    )
    const data: GetUserByIdResponse = await response.json()
    return data
  }
  async anyPendingBeAnAgencyRequest(): Promise<boolean> {
    try {
      const data = await fetchWithAuth(`${this.baseUrl}/Users/AnyPendingBeAnAgencyRequest}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const isPending: boolean = await data.json();
      return isPending;
    } catch (error: any) {
      throw error
    }
  }
}

export const userService = new UserService()
