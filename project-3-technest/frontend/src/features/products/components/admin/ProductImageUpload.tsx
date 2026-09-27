import {
  Button,
  Box,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { ProductImage } from "../../../../types/product.types";

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
        callback: (
          error: unknown,
          result: CloudinaryUploadResult
        ) => void
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
  const widgetRef = useRef<{ open: () => void } | null>(null);
  const imagesRef = useRef<ProductImage[]>(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const handleOpenWidget = () => {
    if (!window.cloudinary) {
      console.error("Cloudinary widget is not loaded.");
      return;
    }

    if (imagesRef.current.length >= 3) {
      return;
    }

    /*
     * Recreate the widget so maxFiles always
     * reflects the number of available slots.
     */
    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        sources: ["local"],
        multiple: true,
        maxFiles: 3 - imagesRef.current.length,
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

        const currentImages = imagesRef.current;

        if (currentImages.length >= 3) {
          return;
        }

        const newImage: ProductImage = {
          url: result.info.secure_url,
          publicId: result.info.public_id,
        };

        const updatedImages = [...currentImages, newImage];

        imagesRef.current = updatedImages;
        onImagesChange(updatedImages);
      }
    );

    widgetRef.current.open();
  };

  const handleRemove = (index: number) => {
    const updatedImages = images.filter(
      (_, imageIndex) => imageIndex !== index
    );

    imagesRef.current = updatedImages;
    onImagesChange(updatedImages);
  };

  const remainingSlots = 3 - images.length;

  return (
    <Stack gap={4}>
      <Box>
        <Text fontWeight="medium">
          Product Images
        </Text>

        <Text fontSize="sm" color="fg.muted" mt={1}>
          Upload up to 3 images. JPG, JPEG, PNG or WebP.
          Maximum 5 MB per image.
        </Text>
      </Box>

      <Button
        type="button"
        variant="outline"
        width={{ base: "100%", sm: "fit-content" }}
        onClick={handleOpenWidget}
        disabled={images.length >= 3}
      >
        {images.length >= 3
          ? "Maximum 3 Images"
          : `Upload Images (${remainingSlots} remaining)`}
      </Button>

      {images.length > 0 && (
        <Stack
          direction={{ base: "column", sm: "row" }}
          gap={5}
          flexWrap="wrap"
        >
          {images.map((image, index) => (
            <Box
              key={image.publicId}
              borderWidth="1px"
              borderColor="border"
              borderRadius="lg"
              bg="bg.muted"
              p={2}
            >
              <Stack gap={2}>
                <Box
                  width="150px"
                  height="150px"
                  overflow="hidden"
                  borderRadius="md"
                >
                  <img
                    src={image.url}
                    alt={`Product image ${index + 1}`}
                    width="150"
                    height="150"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                <Text
                  fontSize="xs"
                  color="fg.muted"
                  textAlign="center"
                >
                  Image {index + 1}
                </Text>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  colorPalette="red"
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  );
};