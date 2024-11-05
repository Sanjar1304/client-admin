export type UserDataDto  = {

  user: UserInfoDto
  access: {
  accessToken: string
    accessTokenExpire: number
    refreshToken: string
    refreshTokenExpire: number
}

}

export type UserInfoDto = {
  id: string
  username: string
  firstName: string
  lastName: string
  phone: string
  email:string
  status:string
  gender: string
  role: {
  id:string
    name: string,
    displayName: string,
    defaultUrl: null| string
    permissions: string[]
}

}

export type UserCheckResponse ={
  data: {
    identity: string;
    message: string;
  };
}
