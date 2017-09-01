'use strict';

// We define mocking implementation for fetch if NO_TEST_MOCKING is not defined
if (!process.env.NO_TEST_MOCKING) {

    self.fetch = jest.fn();
    function _setUpMockResponse(mockType) {
        return (body, extraOptions = {}) => {
            if (typeof body !== 'string') {
                body = JSON.stringify(body);
            }

            fetch[mockType](() =>
                Promise.resolve({
                    ...extraOptions,
                    ok: true,
                    headers: {
                        get: () => ['json']
                    },
                    json: () => Promise.resolve(JSON.parse(body)),
                    text: () => Promise.resolve(body)
                }));
        };
    }

    // Helpers to mock a success response
    fetch.mockResponseSuccess = _setUpMockResponse('mockImplementation');
    fetch.mockResponseSuccessOnce = _setUpMockResponse('mockImplementationOnce');

    // Helpers to mock a failure response
    fetch.mockResponseFailure = error => {
        fetch.mockImplementation(() => Promise.reject(error));
    };
    fetch.mockResponseFailureOnce = error => {
        fetch.mockImplementationOnce(() => Promise.reject(error));
    };

}
