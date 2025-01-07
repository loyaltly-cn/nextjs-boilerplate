export interface AboutItem {
  id: string
  imageUrl: string
  title: string
  description: string
  content: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Chat {
  id: string
  userId: string | null
  userName: string
  status: 'OPEN' | 'CLOSED'
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  content: string
  role: 'USER' | 'ADMIN'
  chatId: string
  createdAt: Date
}

export interface AboutVideo {
  id: string
  url: string
  size: number
  mimeType: string
  createdAt: string
  updatedAt: string
}


export interface View {
    title: string,
    desc: string,
    background: string,
    id: string,
    order: number,
    isActive: boolean,
    createdAt: string,
    updatedAt: string
}

export interface User {
  phoneNumber?: string;
  dateOfBirth?: Date;
  city?: string;
  country?: string;
  postalCode?: string;
  address?: string;
}

export interface CreateUserInput {
  phoneNumber?: string;
  dateOfBirth?: Date;
  city?: string;
  country?: string;
  postalCode?: string;
  address?: string;
}


