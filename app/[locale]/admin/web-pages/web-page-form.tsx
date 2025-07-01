'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { z } from 'zod'

import MdEditor from 'react-markdown-editor-lite'
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import ReactMarkdown from 'react-markdown'
import 'react-markdown-editor-lite/lib/index.css'
import 'highlight.js/styles/github.css'; // Chọn theme phù hợp
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { createWebPage, updateWebPage } from '@/lib/actions/web-page.actions'
import { IWebPage } from '@/lib/db/models/web-page.model'
import { WebPageInputSchema, WebPageUpdateSchema } from '@/lib/validator'
import { Checkbox } from '@/components/ui/checkbox'
import { toSlug } from '@/lib/utils'

const webPageDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        title: 'Sample Page',
        slug: 'sample-page',
        content: 'Sample Content',
      }
    : {
        title: '',
        slug: '',
        content: '',
      }

const WebPageForm = ({
  type,
  webPage,
  webPageId,
}: {
  type: 'Create' | 'Update'
  webPage?: IWebPage
  webPageId?: string
}) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof WebPageInputSchema>>({
    resolver: zodResolver(
      type === 'Update' ? WebPageUpdateSchema : WebPageInputSchema
    ),
    defaultValues:
      webPage && type === 'Update' ? webPage : webPageDefaultValues,
  })

  async function onSubmit(values: z.infer<typeof WebPageInputSchema>) {
    if (type === 'Create') {
      const res = await createWebPage(values)
      if (!res.success) {
        toast.error("Error", {
          description: res.message,
          style: {
            background: "destructive",
          },
        });
      } else {
        toast.success("Success", {
          description: res.message,
        })
        router.push(`/admin/web-pages`)
      }
    }
    if (type === 'Update') {
      if (!webPageId) {
        router.push(`/admin/web-pages`)
        return
      }
      const res = await updateWebPage({ ...values, _id: webPageId })
      if (!res.success) {
        toast.error("Error", {
          description: res.message,
          style: {
            background: "destructive",
          },
        });
      } else {
        router.push(`/admin/web-pages`)
      }
    }
  }

  return (
    <Form {...form}>
      <form
        method='post'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder='Enter title' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>

                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter title slug"
                      {...field}
                      className="pr-24"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const title = form.getValues("title");
                        if (title) {
                          form.setValue("slug", toSlug(title));
                        }
                      }}
                      className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-sm px-3 py-1 bg-muted rounded-md border text-foreground shadow-sm hover:bg-primary transition"
                    >
                      Generate
                    </button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem className='w-full overflow-x-auto'>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <MdEditor
                    value={field.value || ''}
                    // {...field}
                    style={{ height: '500px'}}
                    renderHTML={(text) => <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{text}</ReactMarkdown>}
                    onChange={({ text }) => field.onChange(text)}
                    config={{
                      view: {
                        menu: true,
                        md: true,
                        html: true
                      }
                    }}
                  />

                  {/* <Textarea placeholder='Enter content' {...field} /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name='isPublished'
            render={({ field }) => (
              <FormItem className='space-x-2 items-center'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Is Published?</FormLabel>
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='button col-span-2 w-full'
          >
            {form.formState.isSubmitting ? 'Submitting...' : `${type} Page `}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default WebPageForm