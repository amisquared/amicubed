import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
    collections: {
        blog: defineCollection({
            type: 'page',
            source: 'blog/*.md',

            schema: z.object({
                tags: z.array(z.string()).optional(),
                image: z.string().optional(),
                date: z.date()
            })
        })
    }
})