import { VStack, Heading, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <VStack h="100vh" justify="center" gap={4}>
      <Heading>404</Heading>
      <Text>The page you're looking for doesn't exist.</Text>

      <Link to="/">
        <Button colorPalette="blue">Go Home</Button>
      </Link>
    </VStack>
  );
}
