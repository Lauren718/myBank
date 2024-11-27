import React from 'react';
import {
  useForm,
  FormProvider,
  Controller,
  useFormContext,
} from 'react-hook-form';
import {
  ChakraProvider,
  Box,
  Input,
  FormControl,
  FormLabel,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

type FormData = {
  price: number;
  quantity: number;
  total: number;
};
const fakeData = [
  { price: 100, quantity: 1, total: 100 },
  { price: 200, quantity: 2, total: 400 },
];
// 模擬從 localStorage 讀取資料
const fetchFormData = () => {
  const storedData = localStorage.getItem('formData');
  if (storedData) {
    return JSON.parse(storedData); // 從 localStorage 讀取資料
  }
  
  // 若沒有資料，回傳預設假資料
  return fakeData
};


const submitFormData = async (data: FormData): Promise<void> => {
  console.log('Submitted to server:', data);
  const storedData = JSON.parse(localStorage.getItem('formData') || JSON.stringify(fakeData));
  storedData.push(data); // 把新的資料加入現有的資料中
  localStorage.setItem('formData', JSON.stringify(storedData)); // 儲存更新後的資料
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

  // 使用 useQuery 獲取初始表單數據
  const { data: tableData = [], isLoading } = useQuery(['formData'], fetchFormData, {select: (data) => {
    // 數據選擇器: 只返回數據的一部分
    return data.items;
  }});

  // 使用 useMutation 提交表單
  const mutation = useMutation(submitFormData, {
    onSuccess: () => {
        // 提交成功后，调用 invalidateQueries 使查询重新拉取数据
        queryClient.invalidateQueries(['formData']);

        // 假数据，模拟新增数据
        const fakeNewData = { price: 200, quantity: 3, total: 600 };
        // 直接在缓存中推送新数据
        queryClient.setQueryData(['formData'], (oldData: any) => {
          // 这里是将新数据加入缓存中的原有数据
          return [...oldData, fakeNewData];
        });
  
        console.log('Data submitted and updated in cache');
    },
  });

  // 表格欄位定義
  const columnHelper = createColumnHelper<FormData>();
  const columns = [
    columnHelper.accessor('price', {
      header: 'Price',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('quantity', {
      header: 'Quantity',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('total', {
      header: 'Total',
      cell: (info) => info.getValue(),
    }),
  ];

  // 表格邏輯
  const tableInstance = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 表單邏輯
  const methods = useForm<FormData>({
    defaultValues: {
      price: 0,
      quantity: 0,
      total: 0,
    },
  });

  const { handleSubmit, watch, control, setValue } = methods;

  const onSubmit = (data: FormData) => {
    mutation.mutate(data); // 提交資料
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
              Add Data
            </Button>
          </form>
        </Box>

        {/* 表格部分 */}
        <Box maxW="600px" mx="auto" mt="10">
          <Table variant="simple">
            <Thead>
              <Tr>
                {tableInstance.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <Th key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Th>
                  ))
                )}
              </Tr>
            </Thead>
            <Tbody>
              {tableInstance.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </FormProvider>
    </ChakraProvider>
  );
};

export default MyForm;
