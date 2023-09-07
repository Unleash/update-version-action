export const BigQuery = jest.fn().mockReturnValue({
    createQueryJob: jest.fn().mockReturnValue([{
        getQueryResults: jest.fn().mockReturnValue([[]])
    }])
})