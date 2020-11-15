module.exports.getUserId = function(event) {
    if (event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.claims && event.requestContext.authorizer.claims.sub) {
        return event.requestContext.authorizer.claims.sub
    }
    else if (event.requestContext.accountId === "offlineContext_accountId") {
        console.log("Using fake user ID")
        return "e9c748ed-b38b-44dc-8f84-b8b5df4ffa17"
    }
    else {
        console.log("No request context found:")
        console.log(event.requestContext)
        return null
    }
}