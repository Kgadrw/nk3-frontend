// Cloudinary configuration - check at runtime, not module load time
const getCloudinaryConfig = () => {
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'nk3archtecture';

  if (!CLOUD_NAME) {
    throw new Error(
      'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable is required. ' +
      'Please create a .env.local file in the project root with your Cloudinary credentials. ' +
      'See CLOUDINARY_SETUP.md for instructions.'
    );
  }

  return { CLOUD_NAME, UPLOAD_PRESET };
};

export const uploadToCloudinary = async (file: File, folder: string = 'nk3d'): Promise<string> => {
  const { CLOUD_NAME, UPLOAD_PRESET } = getCloudinaryConfig();
  
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);
    
    // Determine resource type
    const resourceType = file.type.startsWith('image/') ? 'image' : 'raw';
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

    fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          reject(new Error(data.error.message));
        } else {
          resolve(data.secure_url);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

