import { Box, HStack, Image, VStack } from "@chakra-ui/react";
import { useState } from "react";

interface ProductImage {
  url: string;
  alt?: string;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productTitle: string;
}

export const ProductImageGallery = ({
  images,
  productTitle,
}: ProductImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images.length) {
    return (
      <Box
        borderWidth="1px"
        borderColor="border"
        borderRadius="xl"
        bg="bg.panel"
        aspectRatio={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        No image available
      </Box>
    );
  }

  const visibleImages = images.slice(0, 3);
  const selectedImage = visibleImages[selectedIndex] ?? visibleImages[0];

  return (
    <VStack align="stretch" gap={4}>
      {/* Main Image */}
      <Box
        borderWidth="1px"
        borderColor="border"
        borderRadius="xl"
        bg="bg.panel"
        overflow="hidden"
        aspectRatio={1}
      >
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt || productTitle}
          width="100%"
          height="100%"
          objectFit="contain"
          p={6}
        />
      </Box>

      {/* Thumbnails */}
      {visibleImages.length > 1 && (
        <HStack gap={3}>
          {visibleImages.map((image, index) => (
            <Box
              key={`${image.url}-${index}`}
              as="button"
              onClick={() => setSelectedIndex(index)}
              width="80px"
              height="80px"
              borderWidth="2px"
              borderColor={
                selectedIndex === index ? "primary" : "border"
              }
              borderRadius="lg"
              bg="bg.panel"
              overflow="hidden"
              cursor="pointer"
              _hover={{
                borderColor: "primary",
              }}
            >
              <Image
                src={image.url}
                alt={`${productTitle} thumbnail ${index + 1}`}
                width="100%"
                height="100%"
                objectFit="contain"
                p={2}
              />
            </Box>
          ))}
        </HStack>
      )}
    </VStack>
  );
};