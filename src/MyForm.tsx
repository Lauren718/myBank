import React from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { FormControl, FormLabel, FormErrorMessage, Input, Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

// 定義表單驗證規則
const schema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

type FormData = {
  username: string;
  email: string;
};

const MyForm = () => {
  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const { handleSubmit } = methods;

  // 表單提交處理
  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!methods.formState.errors.username}>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Controller
            name="username"
            control={methods.control}
            render={({ field }) => <Input {...field} id="username" />}
          />
          <FormErrorMessage>{methods.formState.errors.username?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!methods.formState.errors.email}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Controller
            name="email"
            control={methods.control}
            render={({ field }) => <Input {...field} id="email" />}
          />
          <FormErrorMessage>{methods.formState.errors.email?.message}</FormErrorMessage>
        </FormControl>

        <Button mt={4} colorScheme="teal" type="submit">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
};

export default MyForm;
