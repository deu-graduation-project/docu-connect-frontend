import { BehaviorSubject } from "rxjs";
import { jwtDecode } from "jwt-decode";
import { getCookie, clearCookie } from "@/services/cookies";

interface DecodedToken {
  exp: number;
  [key: string]: any; // Allow any other claims
}

class AuthService {
  private _isAuthenticated = false;
  private _isAdmin = false;
  private _isAgency = false;
  private _userId: string | null = null;
  private _username: string | null = null;
  private _name: string | null = null;
  private _surname: string | null = null;
  private _email: string | null = null;

  private _authStatusSubject = new BehaviorSubject<{
    isAuthenticated: boolean;
    isAdmin: boolean;
    isAgency: boolean;
    userId: string | null;
    username: string | null;
    name: string | null;
    surname: string | null;
    email: string | null;
  }>({
    isAuthenticated: this._isAuthenticated,
    isAdmin: this._isAdmin,
    isAgency: this._isAgency,
    userId: this._userId,
    username: this._username,
    name: this._name,
    surname: this._surname,
    email: this._email,
  });

  constructor() {
    this.identityCheck();
  }

  public async signOut(): Promise<void> {
    clearCookie("accessToken");
    clearCookie("refreshToken");

    this._isAuthenticated = false;
    this._isAdmin = false;
    this._isAgency = false;
    this._userId = null;
    this._username = null;
    this._name = null;
    this._surname = null;
    this._email = null;

    this._authStatusSubject.next({
      isAuthenticated: this._isAuthenticated,
      isAdmin: this._isAdmin,
      isAgency: this._isAgency,
      userId: this._userId,
      username: this._username,
      name: this._name,
      surname: this._surname,
      email: this._email,
    });
  }

  public async identityCheck(): Promise<void> {
    const token = getCookie("accessToken");

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);

        this._isAuthenticated = !this.isTokenExpired(decoded);
        this._userId =
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ] || null;
        this._isAdmin =
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ]?.includes("admin") || false;
        this._isAgency =
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ]?.includes("agency") || false;
        this._username =
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"
          ] || null;
        this._name =
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ] || null;
        this._surname =
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"
          ] || null;
        this._email =
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ] || null;
      } catch (error) {
        this._isAuthenticated = false;
        this._isAdmin = false;
        this._isAgency = false;
        this._userId = null;
        this._username = null;
        this._email = null;
        this._name = null;
        this._surname = null;
      }
    } else {
      this._isAuthenticated = false;
      this._isAdmin = false;
      this._isAgency = false;
      this._userId = null;
      this._username = null;
      this._email = null;
      this._name = null;
      this._surname = null;
    }

    this._authStatusSubject.next({
      isAuthenticated: this._isAuthenticated,
      isAdmin: this._isAdmin,
      isAgency: this._isAgency,
      userId: this._userId,
      username: this._username,
      name: this._name,
      surname: this._surname,
      email: this._email,
    });
  }

  private isTokenExpired(decodedToken: DecodedToken): boolean {
    return decodedToken.exp * 1000 < Date.now();
  }

  public get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  public get isAdmin(): boolean {
    return this._isAdmin;
  }

  public get isAgency(): boolean {
    return this._isAgency;
  }

  public get userId(): string | null {
    return this._userId;
  }
  public get name(): string | null {
    return this._name;
  }
  public get surname(): string | null {
    return this._surname;
  }
  public get email(): string | null {
    return this._email;
  }
  public get username(): string | null {
    return this._username;
  }

  public authStatus$() {
    return this._authStatusSubject.asObservable();
  }
}

const authService = new AuthService();
export default authService;
