// Subir imagen/vídeo a Cloudflare R2 y devolver URL pública.
// Secrets en Supabase: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME (o R2_BUCKET), R2_PUBLIC_URL

import { S3Client, PutObjectCommand } from 'npm:@aws-sdk/client-s3@3'
import { corsHeaders } from '../_shared/cors.ts'

const R2_ACCOUNT_ID = Deno.env.get('R2_ACCOUNT_ID')
const R2_ACCESS_KEY_ID = Deno.env.get('R2_ACCESS_KEY_ID')
const R2_SECRET_ACCESS_KEY = Deno.env.get('R2_SECRET_ACCESS_KEY')
const R2_BUCKET_NAME = Deno.env.get('R2_BUCKET_NAME') ?? Deno.env.get('R2_BUCKET')
const R2_PUBLIC_URL = Deno.env.get('R2_PUBLIC_URL')?.replace(/\/$/, '') // URL pública del CDN de Cloudflare

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: R2_SECRET_ACCESS_KEY ?? '',
  },
})

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/ogg',
]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_URL) {
      console.error('Variables de entorno de R2 no configuradas')
      return new Response(JSON.stringify({ error: 'Configuración de R2 incompleta' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return new Response(JSON.stringify({ error: 'No se proporcionó ningún archivo' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({
          error: 'Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, WebP, GIF) y vídeos (MP4, WebM, OGG).',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (file.size > MAX_SIZE) {
      return new Response(JSON.stringify({ error: 'El archivo es demasiado grande. Máximo 5MB' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const folder = (formData.get('folder') as string) || 'uploads'
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${folder}/${timestamp}-${randomString}.${fileExtension}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    await s3Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    )

    const publicUrl = `${R2_PUBLIC_URL}/${fileName}`

    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        fileName,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error al subir imagen:', error)
    return new Response(
      JSON.stringify({
        error: 'Error al subir la imagen',
        message: error instanceof Error ? error.message : 'Error desconocido',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
