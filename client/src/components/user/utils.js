async function handlePostResponse(response) {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson && await response.json();
    console.log(data.msg);
    // check for error response
    if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
    }
}

export default handlePostResponse;