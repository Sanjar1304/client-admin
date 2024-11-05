import {Paging} from './common.type';

export type BannerList = {
  id: string
  productName: string
  title: string
  description: string
  redirectUrl: string
  btnText: string
  imageUrl: string
  textColour: string
  backgroundColors: string[]
  btnColors: string[]
  indicatorBorderColors: string[]
  bannerProductType: string
}

export type BannerDto = {
  items: BannerList[]
  paging: Paging
}


export type BannerCreateRequestDto = {
    title: string
    description: string
    redirectUrl: string
    btnText: string
    imageUrl: string
    textColour: string
    backgroundColors: string[]
    btnColors: string[]
    indicatorBorderColors: string[]
    bannerProductType: string
  }

export type BannerOneDto = {
  id: string
  title: [
    {
      text: string
      lang: string
    }
  ]
  description: [
    {
      text: string
      lang: string
    }
  ]
  redirectUrl: string
  btnText: [
    {
      text: string
      lang: string
    }
  ]
  imageUrl: string
  textColour: string
  backgroundColors: string[]
  btnColors: string[]
  indicatorBorderColors:string[]
  bannerProductType: string
}
