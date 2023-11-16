import { type Timestamp } from 'firebase/firestore'

interface Friend {
    id: string
    bodyText: string
    updatedAt: Timestamp
}

export type { Friend }