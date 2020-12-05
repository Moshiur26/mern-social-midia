const create = async (params, credentials, post) => {
    try {
        let response = await fetch('/api/posts/new/' + params.userId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: post
        })
        return await response.json()
    } catch(err) {
        console.log(err);
    }
}
const listNewsFeed = async (params, credentials, signal) => {
    try {
        let response = await fetch('/api/posts/feed/' + params.userId, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        console.log("listNewsFeed response: ", await response);
        return await response.json()
    } catch(err) {
        console.log("error: ", err);
    }
}

const listByUser = async (params, credentials) => {
    try {
        let response = await fetch('/api/posts/by/' + params.userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        return await response.json()
    } catch(err) {
        console.log(err);
    }
}
const remove = async (params, credentials) => {
    try {
        console.log("api-post remove 1");
        let response = await fetch('/api/posts/' + params.postId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
        })
        console.log("api-post remove response", await response);
        return await response.json()
    } catch (err) {
        console.log(err);
    }
}
export { listNewsFeed, listByUser, create, remove }