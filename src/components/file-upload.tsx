import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from './ui/button'
import { Upload, X, File, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface FileUploadProps {
  bucket: string
  path?: string
  onUpload: (url: string) => void
  accept?: string
}

export function FileUpload({ bucket, path = 'uploads', onUpload, accept = 'image/*' }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = event.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${path}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      onUpload(publicUrl)
      toast.success('File uploaded successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error uploading file')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept={accept}
        onChange={handleUpload}
        disabled={uploading}
      />
      <label htmlFor="file-upload">
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer gap-2"
          asChild
          disabled={uploading}
        >
          <span>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Uploading...' : 'Upload File'}
          </span>
        </Button>
      </label>
    </div>
  )
}