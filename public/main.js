if ('SharedWorker' in window) {

    // Generate uuid (relying on an external script at this point)
    const uuid = window.uuid.v4();
    //console.log('Generated UUID : ' + uuid);

    const worker = new SharedWorker('shared-worker.js');
    const broadcastChannel = new BroadcastChannel('shared-worker-channel');

    broadcastChannel.onmessage = (event) => {
        const message = event.data;
        log_message = 'Received message via Broadcast Channel'
        console.log(log_message + ' : ', message);
        statusDiv.innerHTML = log_message;
        messageDiv.innerHTML = message;
    };

    worker.port.onmessage = (event) => {
        const message = event.data;
        log_message = 'Received message via Shared Worker'
        console.log(log_message + ' : ', message);
        statusDiv.innerHTML = log_message;
        messageDiv.innerHTML = message;
    };

    worker.port.postMessage({
        'type': "message",
        'message': 'Hello from the main page!',
        'client_id': uuid
    });


    // Test code to send a message to the shared worker
    function buttonClick(event) {
        event.preventDefault();
        worker.port.postMessage({
            'type': "message",
            'message': 'Sending a message',
            'client_id': uuid
        });
    }
    document.getElementById('send_button').onclick = buttonClick;

}

// //shouldnt this be emitted back from shared worker as woker.port ?
// const broadcastChannel = new BroadcastChannel("shared-worker");
// broadcastChannel.addEventListener("message", event => {
//     console.log("Broadcast channel");
//     console.log(event.data);
//     switch (event.data.type) {
//         case "WSState":
//             webSocketState = event.data.state;
//             break;
//         case "message":
//             handleBroadcast(event.data);
//             break;
//     }
// });

// // Check if the browser supports Shared Workers.
// if (window.SharedWorker) {

//     // Generate uuid (relying on an external script at this point)
//     const uuid = window.uuid.v4();
//     console.log(uuid);

//     // Initialize the Shared Worker.
//     const worker = new SharedWorker('shared-worker.js');

//     // Attach an event listener to receive messages from the worker.
//     worker.port.onmessage = function (event) {
//         console.log('Message from Shared Worker:', event.data);
//     };

//     // Send a message to the worker.
//     worker.port.postMessage({
//         'message': 'Hello from the main page!',
//         'client_id': uuid
//     });

// } else {
//     console.error('Shared Workers are not supported in this browser.');
// }
