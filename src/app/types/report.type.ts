import {Paging} from './common.type';

export type TopicDto = {
  items: TopicItems[]
  paging: Paging
}

export type TopicItems = {
  id: string
  name: string
}

export type SectionItems = {
  translates: Translates[]
  orderNum: 0

}

export type Translates = {
  title: string
  content: string
  lang: string
  imageUrls: string[]
}


export type ReportDto = {
  items: ReportItems[]
  paging: Paging
}

export type ReportItems = {
  id: string
  title: string
  description: string
  sections: [
    {
      id: string
      title: string
      content: string
      orderNum: number
      imageUrls: string[]
    }
  ]
  topic: {
    id: string
    name: string
  }
  publishingDate: string
  endDate: string
  publishOnDate: boolean
  hideOnEndDate: boolean
}

export type SectionOneDto = {
  id: string
  title: TextLang[]
  description: TextLang[]
  imageUrls:ImageUrls[]
  order:number
}
export type TextLang = {
  text: string
  lang: string
}

export type ImageUrls = {
  values: string[]
  lang: string
}
