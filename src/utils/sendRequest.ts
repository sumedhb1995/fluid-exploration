export async function sendRequest(type: "GET" | "POST", payload?: number): Promise<number> {
    // Creating the XMLHttpRequest object
    var request = new XMLHttpRequest();

    // Instantiating the request object
    request.open(type, "http://localhost:8000");

    // Doing some fancy stuff so I can use async/await
    let res: (value: number | PromiseLike<number>) => void;
    const p = new Promise<number>((r) => res = r);
    // Defining event listener for readystatechange event
    request.onreadystatechange = function () {
        // Check if the request is compete and was successful
        if (request.readyState === request.DONE) {
            console.log(`RESPONSE: ${request.status}-${request.responseText}`);
            res(parseInt(request.responseText));
        }
    };

    // Sending the request to the server
    if (type === "POST") {
        request.send(payload?.toString())
    } else {
        request.send();
    }
    return p;
}