export interface BlogPost {
  path?: string | null
  title?: string | null
  description?: string | null
  image?: string | null
  date?: Date | string | null
  tags?: string[] | null
}