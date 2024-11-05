import {Paging} from './common.type';

export type CarouselDto = {
  items: CarouselItems[]
  paging: Paging
}
export type CarouselItems =
  {
    id: string
    banner: {
      id: string
      title: string
      description: string
      redirectUrl: string
      btnText: string
      imageUrl: string
      textColour: string
      backgroundColors: string[]
      btnColors: string[]
      indicatorBorderColors: string []
      bannerProductType: string
    }
    orderNum: 0
    productId: string
    carouselType: string
  }
export type CarouselCreateDto = {
  bannerId: string
  orderNum: number
  productId: string
  carouselType: string
}
export type CarouselUpdateDto = {
  id:string
  bannerId: string
  orderNum: number
  productId: string
  carouselType: string
}

export type CarouselOneDto = {
  id: string
  banner: {
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
    indicatorBorderColors: string[]
    bannerProductType: string
  }
  orderNum: number
  productId: string | null
  carouselType: string
}
