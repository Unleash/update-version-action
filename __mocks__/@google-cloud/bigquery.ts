export const BigQuery = jest.fn().mockReturnValue({
  createQueryJob: jest.fn().mockReturnValue([
    {
      getQueryResults: jest.fn().mockReturnValue([[]]),
    },
  ]),
  dataset: jest.fn().mockReturnValue({
    table: jest.fn().mockReturnValue({
      query: jest.fn()
    })
  })
});
