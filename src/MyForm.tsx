import React from 'react';
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
} from 'react-hook-form';
import {
  ChakraProvider,
  Box,
  Input,
  FormControl,
  FormLabel,
  Button,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type FormData = {
  price: number;
  quantity: number;
  total: number;
};

// 模擬 API 請求函數
const fetchFormData = async (): Promise<FormData> => {
  // 模擬 API 回應
  return new Promise((resolve) =>
    setTimeout(() => resolve({ price: 100, quantity: 2, total: 200 }), 1000)
  );
};

const submitFormData = async (data: FormData): Promise<void> => {
  console.log('Submitted to server:', data);
};

const TotalField = () => {
  const { watch, setValue } = useFormContext<FormData>();
  const price = watch('price');
  const quantity = watch('quantity');

  React.useEffect(() => {
    if (price && quantity) {
      setValue('total', price * quantity); // 計算總價
    } else {
      setValue('total', 0);
    }
  }, [price, quantity, setValue]);

  return (
    <FormControl>
      <FormLabel>Total</FormLabel>
      <Input value={price && quantity ? price * quantity : 0} isReadOnly />
    </FormControl>
  );
};

const MyForm = () => {
  const queryClient = useQueryClient();

  const methods = useForm<FormData>({
    defaultValues: {
      price: 0,
      quantity: 0,
      total: 0,
    },
  });

  const { handleSubmit, setValue, control } = methods;

  // 使用 useQuery 獲取初始表單數據
  const { data, isLoading } = useQuery(['formData'], fetchFormData, {
    onSuccess: (data) => {
      // 預設值填充
      setValue('price', data.price);
      setValue('quantity', data.quantity);
      setValue('total', data.total);
    },
  });

  // 使用 useMutation 提交表單
  const mutation = useMutation(submitFormData, {
    onSuccess: () => {
      console.log('Data submitted successfully!');
      queryClient.invalidateQueries(['formData']); // 提交成功後重新拉取數據
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data); // 提交表單數據
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <ChakraProvider>
      <FormProvider {...methods}>
        <Box maxW="400px" mx="auto" mt="20">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Price Field */}
            <FormControl mb="4">
              <FormLabel>Price</FormLabel>
              <Controller
                name="price"
                control={control}
                render={({ field }) => <Input type="number" {...field} />}
              />
            </FormControl>

            {/* Quantity Field */}
            <FormControl mb="4">
              <FormLabel>Quantity</FormLabel>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => <Input type="number" {...field} />}
              />
            </FormControl>

            {/* Total Field */}
            <TotalField />

            <Button
              colorScheme="blue"
              type="submit"
              mt="4"
              isLoading={mutation.isLoading}
            >
              Submit
            </Button>
          </form>
        </Box>
      </FormProvider>
    </ChakraProvider>
  );
};

export default MyForm;
