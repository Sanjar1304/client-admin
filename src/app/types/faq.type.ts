import {Paging} from './common.type';

export type FaqListDto = {
  items: FaqItems[]
  paging: Paging
}

export type FaqItems = {
  id: string
  question: string
  answer: string
  productId: string
  tags: string[]
}

export type FaqCreateDto = {
  question: [
    {
      text: string
      lang: string
    }
  ]
  answer: [
    {
      text: string
      lang: string
    }
  ]
  productId: string
  tags: string[]
  faqProductType: string
}

export type FaqOneDto = {
  id: string
  question: [
    {
      text: string
      lang: string
    }

  ]
  answer: [
    {
      text: string
      lang: string
    }

  ]
  productId: string | null
  faqProductType:string
  tags: string[]
}
