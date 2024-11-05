import {Paging} from './common.type'

export type ProductListDto = {
  items: ProductItems[]
  paging: Paging
}
export interface Banner {
  id: string
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

export interface InfoChunk {
  title: string
  content: string
}

export interface ProductAdvantage {
  title: string
  content: string
  imageUrl: string
}

export interface ProductItems {
  id: string
  name: string
  productType: string
  productUserType: string
  banner: Banner
  currency: string
  infoChunks: InfoChunk[]
  productAdvantages: ProductAdvantage[]
}
