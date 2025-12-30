# Cloudinary Setup Instructions

Cloudinary has been integrated for image and PDF uploads. Follow these steps to complete the setup:

## 1. Create Environment File

Create a `.env.local` file in the root directory of your project with the following content:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dgmexpa8v
NEXT_PUBLIC_CLOUDINARY_API_KEY=577674637224497
NEXT_PUBLIC_CLOUDINARY_API_SECRET=_8Ks_XU3nurQTFUbVA3RxpbcXFE
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=nk3archtecture
CLOUDINARY_URL=cloudinary://577674637224497:_8Ks_XU3nurQTFUbVA3RxpbcXFE@dgmexpa8v
```

## 2. Backend Environment File

Update `backend/.env` with the same Cloudinary credentials:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dgmexpa8v
CLOUDINARY_API_KEY=577674637224497
CLOUDINARY_API_SECRET=_8Ks_XU3nurQTFUbVA3RxpbcXFE
CLOUDINARY_UPLOAD_PRESET=nk3archtecture
CLOUDINARY_URL=cloudinary://577674637224497:_8Ks_XU3nurQTFUbVA3RxpbcXFE@dgmexpa8v
```

## 3. How It Works

- **Images**: When you upload images in the admin dashboard (portfolio, team, shop, etc.), they are automatically uploaded to Cloudinary and stored in the `nk3d/images` folder.
- **PDFs**: PDF files uploaded in the academic section are stored in the `nk3d/pdfs` folder on Cloudinary.
- **Upload Preset**: The upload preset `nk3archtecture` is configured to allow unsigned uploads from the frontend.

## 4. Features

- ✅ Automatic upload to Cloudinary on file selection
- ✅ Local preview while uploading
- ✅ Organized folder structure (images and PDFs)
- ✅ Secure URL generation
- ✅ Error handling with fallback to local preview

## 5. Testing

After setting up the environment variables:

1. Restart your development server
2. Go to the admin dashboard
3. Try uploading an image or PDF
4. Check that the URL in the preview is a Cloudinary URL (should start with `https://res.cloudinary.com/`)

## Notes

- The upload preset must be configured in your Cloudinary dashboard to allow unsigned uploads
- Files are organized in folders: `nk3d/images` for images and `nk3d/pdfs` for PDFs
- If Cloudinary upload fails, the system will keep the local preview as a fallback

