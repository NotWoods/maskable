function toDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.onabort = () => reject(new Error('Read aborted'));
    reader.readAsDataURL(blob);
  });
}

export default async function open(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const body = await req.formData();
  const image = body.get('image');
  if (image === null || typeof image === 'string') {
    return new Response('Unsupported Media Type', { status: 415 });
  }

  const demoUrl = await toDataUrl(image);
  const params = new URLSearchParams({ demo: demoUrl });

  return Response.redirect(new URL(`/?${params}`, req.url).href, 303);
}
