import { NextPage } from "next";
import { Formik, Form } from "formik";
import { Wrapper } from "../components/Wrapper";
import { Box, Button } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useRegisterMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { toErrorMap } from "../utils/toErrorMap";

interface IRegisterProps {}

const Register: NextPage<IRegisterProps> = () => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{
          firstname: "",
          lastname: "",
          username: "",
          password: "",
        }}
        onSubmit={async (values, {setErrors}) => {
          const response = await register({ input: values });
          const errors = response.data?.register.errors;
          const user = response.data?.register;
      
          if(errors){
            setErrors(toErrorMap(errors))
            return
          }

          if (user) {
            router.push(`login`);
          }

        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                name="firstname"
                placeholder="firstname"
                label="firstname"
                type="firstname"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="lastname"
                placeholder="lastname"
                label="lastname"
                type="lastname"
              />
            </Box>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="password"
                type="password"
              />
            </Box>
            <Button
              type="submit"
              mt={4}
              isLoading={isSubmitting}
              colorScheme="blue"
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Register);
