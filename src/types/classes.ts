export enum OrderState {
  Pending = 0,
  Confirmed = 1,
  Rejected = 2,
  Started = 3,
  Finished = 4,
  Completed = 5,
}
export enum BeAnAgencyRequestState {
  Pending = 0,
  Confirmed = 1,
  Rejected = 2,
}
export class CopyFile {
  fileName!: string
  fileCode?: string
  filePath?: string
}
export class GetOrders {
  orderId?: string
  OrderCode!: string
  AgencyName!: string
  CustomerUserName!: string
  TotalPrice!: number
  SayfaSayısı!: number
  KopyaSayısı!: number
  CreatedDate!: Date
  orderState!: OrderState
  productPaperType!: string
  productColorOption!: string
  productPrintType!: string
  PricePerPage!: number
  CopyFile!: CopyFile[]
}
export class GetSingleOrder {
  orderId?: string
  OrderCode!: string
  AgencyName!: string
  CustomerName!: string
  TotalPrice!: number
  PricePerPage!: number
  TotalPage!: number
  PrintType!: string
  PaperType!: string
  ColorOption!: string
  KopyaSayısı!: string
  CreatedDate!: Date
  OrderState!: OrderState
  CopyFiles!: CopyFile[]
  CompletedCode?: string
}
export class GetAgencyAnalytics {
  Period!: string
  TotalPrice!: number
  TotalPageCount!: number
  TotalCompletedOrder!: number
}
export class CreateAgencyProduct {
  ProductId!: string
  Price!: number
}
export class GetAgencyProducts {
  Id!: string
  PaperType!: string
  ColorOption!: string
  PrintType!: string
  Price!: number
}
export class GetProducts {
  id!: string
  paperType!: string
  colorOption!: string
  printType!: string
}
export interface User {
  userName: string
  name: string
  surname: string
  email: string
  password: string
  passwordConfirm: string
}

export interface UserCreate {
  id: string
  name: string
  email: string
}
export interface Address {
  province: string
  district: string
  extra: string
}
export interface GetBeAnAgencyRequests {
  beAnAgencyRequestId: string
  agencyName: string
  agencyId: string
  beAnAgencyRequestState: BeAnAgencyRequestState // Note the lowercase 'b'
  address: Address
  name: string
  surname: string
  email: string
  profilePhoto: string | null
}

export interface UpdateAgencyInfos {
  name?: string
  surname?: string
  agencyName?: string
  province?: string
  district?: string
  extra?: string
  agencyBio?: string
  profilePhoto?: File
}

export interface AgencyProduct {
  productId: string
  printType: string
  colorOption: string
  paperType: string
  price: number
}

export interface AgencyComment {
  commentText: string
  starRating: string
  userName: string
  createdDate: Date
}
export interface GetAgencies {
  agencyId: string
  agencyName: string
  province: string
  district: string
  extra: string
  starRating: number
  profilePhoto: string | null
}
export interface Agency {
  agencyId: string
  agencyName: string
  agencyBio: string
  province: string
  district: string
  addressExtra: string
  agencyProducts: AgencyProduct[]
  comments: AgencyComment[]
  starRating: number
  profilePhoto: string | null
}

export interface GetSingleAgency {
  agency: Agency
}

export interface VerifyResetTokenResponse {
  state: boolean
}

export interface SucceededMessageResponse {
  success: boolean // Indicates whether the operation was successful
  message: string // A message describing the result of the operation
}

export interface TokenResponse {
  token: {
    accessToken: string // The access token
    refreshToken: string // The refresh token
  }
}

export interface SocialUser {
  id: string // Unique identifier from the social provider
  email: string // User's email
  name: string // User's full name
  imageUrl: string // URL of the user's profile picture
}
export interface GetUserByIdResponse {
  userId: string
  userName: string
  name: string
  surname: string
  email: string
  emailConfirmed: boolean
  userOrders: {
    orderCode: string
    orderState: string
    totalPrice: number
    kopyaSayısı: number
    sayfaSayısı: number
    agencyName: string
    customerName: string
    product: {
      price: number
      printType: string
      paperType: string
      colorOption: string
    }
    copyFiles: {
      fileName: string
      filePath: string
    }[]
  }[]
  userComments: {
    commentText: string
    starRating: number
    createdDate: Date
    userName: string
  }[]
}
