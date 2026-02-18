// Edge Function: subir imagen a Cloudflare R2 (S3-compatible) y devolver URL pública.
// Secrets en Supabase: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL

import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3@3.700.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function getEnv(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  try {
    const accountId = getEnv("R2_ACCOUNT_ID");
    const accessKeyId = getEnv("R2_ACCESS_KEY_ID");
    const secretAccessKey = getEnv("R2_SECRET_ACCESS_KEY");
    const bucket = getEnv("R2_BUCKET");
    const publicBaseUrl = getEnv("R2_PUBLIC_URL").replace(/\/$/, "");

    const contentType = req.headers.get("Content-Type") || "";
    let body: Uint8Array;
    let key: string;
    let type = "image/jpeg";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file") as File | null;
      const folder = (form.get("folder") as string) || "uploads";
      if (!file) {
        return new Response(JSON.stringify({ error: "Missing field: file" }), {
          status: 400,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      type = file.type || "application/octet-stream";
      const ext = file.name.split(".").pop() || "bin";
      key = `${folder}/${crypto.randomUUID()}.${ext}`;
      body = new Uint8Array(await file.arrayBuffer());
    } else if (contentType.includes("application/json")) {
      const json = (await req.json()) as { data?: string; key?: string; folder?: string };
      const b64 = json.data;
      const folder = json.folder || "uploads";
      if (!b64) {
        return new Response(JSON.stringify({ error: "Missing field: data (base64)" }), {
          status: 400,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      key = json.key || `${folder}/${crypto.randomUUID()}.jpg`;
      body = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      if (json.type) type = json.type;
    } else {
      return new Response(
        JSON.stringify({ error: "Use multipart/form-data (file) or application/json (data base64)" }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
    const client = new S3Client({
      region: "auto",
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: type,
      })
    );

    const url = `${publicBaseUrl}/${key}`;
    return new Response(JSON.stringify({ url, key }), {
      status: 200,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
