import { Button, Stack, Text } from "@chakra-ui/react";
import { useRef } from "react";

export interface ProductImage {
  url: string;
  publicId: string;
}

interface ProductImageUploadProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
}

interface CloudinaryUploadResult {
  event: string;
  info: {
    secure_url: string;
    public_id: string;
  };
}

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: unknown, result: CloudinaryUploadResult) => void,
      ) => {
        open: () => void;
      };
    };
  }
}

export const ProductImageUpload = ({
  images,
  onImagesChange,
}: ProductImageUploadProps) => {
  const widgetRef = useRef<{
    open: () => void;
  } | null>(null);

  const handleOpenWidget = () => {
    if (!window.cloudinary) {
      console.error("Cloudinary widget is not loaded.");
      return;
    }

    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,

          uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,

          sources: ["local"],

          multiple: false,

          maxFiles: 3,

          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],

          maxFileSize: 5000000,
        },

        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return;
          }

          if (result.event !== "success") {
            return;
          }

          const newImage: ProductImage = {
            url: result.info.secure_url,
            publicId: result.info.public_id,
          };

          onImagesChange([...images, newImage]);
        },
      );
    }

    widgetRef.current.open();
  };

  return (
    <Stack gap={4}>
      <Text fontWeight="medium">Product Images</Text>

      <Button
        type="button"
        variant="outline"
        onClick={handleOpenWidget}
        disabled={images.length >= 3}
      >
        {images.length >= 3 ? "Maximum 3 Images" : "Upload Images"}
      </Button>

      {images.length > 0 && (
        <Stack direction="row" gap={4} flexWrap="wrap">
          {images.map((image, index) => (
            <Stack key={image.publicId} gap={2} align="center">
              <img
                src={image.url}
                alt={`Product image ${index + 1}`}
                width="150"
                height="150"
                style={{
                  objectFit: "cover",
                }}
              />

              <Button
                type="button"
                size="sm"
                variant="outline"
                colorPalette="red"
                onClick={() => {
                  const updatedImages = images.filter(
                    (_, imageIndex) => imageIndex !== index,
                  );

                  onImagesChange(updatedImages);
                }}
              >
                Remove
              </Button>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
