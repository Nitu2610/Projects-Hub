import { Heading } from "@chakra-ui/react";
import { useGetMeQuery } from "../redux/api/apiSlice";

export const Home = () => {
  const { isLoading, data, isError, error } = useGetMeQuery();

  console.log("isloading:", isLoading);

  if (isLoading) {
    return <Heading>Loading ...</Heading>;
  }

  if (isError) {
    return (
      <Heading>
        {"data" in error && typeof error.data === "object" && error.data !== null
          ? "message" in error.data && typeof error.data.message === "string"
            ? error.data.message
            : "Something went wrong."
          : "Something went wrong."}
      </Heading>
    );
  }

  return (
    <>
      <div>Home page</div>
      <Heading>
        Welcome, {data?.data?.fullName} as {data?.data?.role}
      </Heading>
    </>
  );
};