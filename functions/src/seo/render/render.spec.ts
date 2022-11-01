import { requestHandler, RequestHandlerDeps } from './request-handler'

const mockRequest = (userAgent = '') =>
  ({
    headers: {
      'user-agent': userAgent,
    },
    path: '',
  } as any)

const mockResponse = () => ({
  status: jest.fn().mockReturnThis(), // allow chaining .status().
  send: jest.fn(),
})

describe('handle SEO rendering', () => {
  let mockFileReader = jest.fn()
  let mockHttpClient = jest.fn()
  let mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }

  const factory = (overrides: Partial<RequestHandlerDeps> = {}) =>
    requestHandler({
      httpClient: mockHttpClient,
      syncFileReader: mockFileReader as any,
      prerenderApiKey: 'prerender-api-token',
      deploymentUrl: 'https://example.com',
      logger: mockLogger,
      ...overrides,
    })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('returns index.html when prerender api key not available', async () => {
    // Arrange
    const req = mockRequest('googlebot')
    const res = mockResponse()
    mockFileReader.mockReturnValue('fish')
    const cloudFunction = factory({
      prerenderApiKey: null,
    })

    // Act
    await cloudFunction(req, res)

    // Assert
    expect(mockHttpClient).not.toBeCalled()
    expect(mockFileReader).toHaveBeenCalledTimes(1)
    expect(res.send).toBeCalledWith('fish')
  })

  it('returns index.html via http when file read fails', async () => {
    // Arrange
    const req = mockRequest()
    const res = mockResponse()
    mockFileReader.mockImplementation(() => {
      throw new Error('Issue accessing file')
    })
    mockHttpClient.mockResolvedValue({ data: 'fish' })
    const cloudFunction = factory()

    // Act
    await cloudFunction(req, res)

    // Assert
    expect(mockHttpClient).toBeCalledTimes(1)
    expect(res.send).toBeCalledWith('fish')
  })

  it('returns index.html if prerender fetch throws an error', async () => {
    // Arrange
    const req = mockRequest()
    const res = mockResponse()
    mockHttpClient.mockRejectedValue('Error')
    mockFileReader.mockReturnValue('def')
    const cloudFunction = factory()

    // Act
    await cloudFunction(req, res)

    // Assert
    expect(mockFileReader).toHaveBeenCalledTimes(1)
    expect(res.send).toHaveBeenCalledWith('def')
  })

  it('returns valid response if prerender fetch returns a 4xx', async () => {
    // Arrange
    const req = mockRequest('googlebot')
    const res = mockResponse()
    mockHttpClient.mockResolvedValueOnce({
      status: 404,
      data: '404 Not found',
    })
    const cloudFunction = factory({
      prerenderApiKey: 'iDIJ3tlSz7SXpqwDQ67a',
    })

    // Act
    await cloudFunction(req, res)

    // Assert
    expect(res.status).toBe(404)
    expect(res.send).toHaveBeenCalledWith('404 Not found')
  })

  it('returns index.html for non-bot user', async () => {
    // Arrange
    const req = mockRequest()
    const res = mockResponse()
    mockFileReader.mockReturnValue('abc')
    const cloudFunction = factory()

    // Act
    await cloudFunction(req, res)

    // Assert
    expect(mockFileReader).toHaveBeenCalled()
    expect(res.send).toHaveBeenCalledWith('abc')
  })

  it('returns error response when index.html inaccessible', async () => {
    // Arrange
    const req = mockRequest()
    const res = mockResponse()
    mockFileReader.mockImplementation(() => {
      throw new Error('Issue accessing file')
    })
    mockHttpClient.mockRejectedValue('Error')

    const cloudFunction = factory()

    // Act
    await cloudFunction(req, res)

    // Assert
    expect(mockLogger.error).toHaveBeenCalledTimes(3)
    expect(res.status).toBe(500)
    expect(res.send).toHaveBeenCalledWith('error')
  })

  it('returns html using prerender.io for bot users', async () => {
    // Arrange
    const req = mockRequest('googlebot')
    const res = mockResponse()
    mockHttpClient.mockReturnValue({ data: 'abc' })

    const cloudFunction = factory()

    // Act
    await cloudFunction(req, res)

    // Assert
    expect(mockHttpClient).toHaveBeenCalledWith(
      expect.stringContaining('example.com'),
      expect.objectContaining({
        headers: { 'X-Prerender-Token': 'prerender-api-token' },
      }),
    )
    expect(res.send).toHaveBeenCalledWith('abc')
  })
})
