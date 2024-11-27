export const createGetCommonUseAccount: CreateQueryHook<BankCommonUsedAccountResponse> = 
(select, { globalLoading, queryOptions } = {}) => () => {
  // 從 Atom 中取得客戶 ID
  const customerId = useAtomValue(custIdAtom);

  // 使用 useQuery 進行資料查詢
  const result = useQuery<
    BankCommonUsedAccountResponse, // 查詢結果的類型
    LeftPayload,                  // 錯誤回應的類型
    ReturnType<typeof select>     // select 函數返回的類型
  >({
    queryKey: OnlineBankAPI.B_ACCT_Q_CommonUseAccountKey(), // 緩存的唯一鍵值
    queryFn: async () =>
      decorateLoading(OnlineBankAPI.fetchB_ACCT_Q_CommonUseAccount, globalLoading)({
        data: { customerId }, // 傳遞給 API 的參數
      }).then(getOrThrow), // 如果有錯誤，會拋出例外
    select, // 選擇函數，將結果轉換為需要的格式
    ...queryOptions, // 其他選項（例如緩存時間）
  });

  return result; // 回傳查詢結果
};
