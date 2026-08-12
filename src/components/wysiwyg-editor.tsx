import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Undo,
  Redo
} from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface EditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function WYSIWYGEditor({ content, onChange, placeholder }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  })

  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link')['href'] as string | undefined
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background text-foreground">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-secondary/20">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          icon={<Bold className="h-4 w-4" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          icon={<Italic className="h-4 w-4" />}
        />
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          icon={<Heading1 className="h-4 w-4" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          icon={<Heading2 className="h-4 w-4" />}
        />
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          icon={<List className="h-4 w-4" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          icon={<ListOrdered className="h-4 w-4" />}
        />
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton
          onClick={setLink}
          active={editor.isActive('link')}
          icon={<LinkIcon className="h-4 w-4" />}
        />
        <ToolbarButton
          onClick={addImage}
          icon={<ImageIcon className="h-4 w-4" />}
        />
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          icon={<Undo className="h-4 w-4" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          icon={<Redo className="h-4 w-4" />}
        />
      </div>
      <EditorContent editor={editor} className="min-h-[200px]" />
    </div>
  )
}

function ToolbarButton({ 
  onClick, 
  active, 
  disabled, 
  icon 
}: { 
  onClick: () => void; 
  active?: boolean; 
  disabled?: boolean; 
  icon: React.ReactNode 
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-8 w-8",
        active && "bg-brand text-brand-foreground hover:bg-brand/90"
      )}
    >
      {icon}
    </Button>
  )
}