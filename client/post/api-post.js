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
        console.log("response: ", await response);
        return await response.json()
    } catch(err) {
        console.log("error: ", err);
    }
}
// const listNewsFeed = async (params, credentials, signal) => {
//     try {
//       console.log("listNewsFeed in api-post-1");
//       let response = await fetch('/api/posts/feed/'+ params.userId, {
//         method: 'GET',
//         signal: signal,
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer ' + credentials.t
//         }
//       })
//     //   console.log("listNewsFeed in api-post-2");
//     //   console.log("response: ", await response);    
//       return await response.json()
//     } catch(err) {
//       console.log(err)
//     }
//   }
  
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
export { listNewsFeed, listByUser, create }