import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  useToast,
  Heading,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { signinAction } from "../../Redux/Auth/Action";
import { getUserProfileAction } from "../../Redux/User/Action";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
});

const Signin = () => {
  const initialValues = { email: "methsan@gmail.com", password: "" };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, signin } = useSelector((store) => store);
  const toast = useToast();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(getUserProfileAction(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (user?.reqUser?.username && token) {
      navigate(`/${user.reqUser.username}`);
      toast({
        title: "Signed in successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [user, navigate, token, toast]);

  const handleSubmit = (values, actions) => {
    dispatch(signinAction(values));
    actions.setSubmitting(false);
  };

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      w="100vw"
      h="100vh"
      bgImage="url('https://images.pexels.com/photos/247819/pexels-photo-247819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      <Box
        bg="whiteAlpha.900"
        p={8}
        borderRadius="lg"
        boxShadow="2xl"
        maxW="400px"
        w="full"
      >
        <VStack spacing={4}>
          <Image
            src="https://scorebeyond.com/wp-content/uploads/2023/05/Skillshare-Logo.jpg"
            alt="Skillshare Logo"
            width="160px"
          />
          <Heading size="md">Welcome Back</Heading>
          <Text fontSize="sm" color="gray.600" textAlign="center">
            Sign in to continue your learning journey and access thousands of creative classes.
          </Text>
        </VStack>

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {(formikProps) => (
            <Form>
              <Field name="email">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.email && form.touched.email}
                    mt={6}
                  >
                    <Input {...field} id="email" placeholder="Email Address" />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="password">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.password && form.touched.password}
                    mt={4}
                  >
                    <Input
                      {...field}
                      type="password"
                      id="password"
                      placeholder="Password"
                    />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Button
                mt={6}
                colorScheme="blue"
                type="submit"
                width="full"
                isLoading={formikProps.isSubmitting}
              >
                Sign In
              </Button>

              <Button
                as="a"
                href="http://localhost:5454/oauth2/authorization/google"
                variant="outline"
                colorScheme="red"
                mt={3}
                width="full"
              >
                Sign in with Google
              </Button>
            </Form>
          )}
        </Formik>

        <Text mt={5} fontSize="sm" textAlign="center">
          Don't have an account?{" "}
          <Text
            as="span"
            color="blue.600"
            cursor="pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Text>
        </Text>
      </Box>
    </Box>
  );
};

export default Signin;
