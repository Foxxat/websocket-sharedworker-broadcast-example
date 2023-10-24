if ('SharedWorker' in window) {

    // Generate uuid (relying on an external script at this point)
    //const uuid = window.uuid.v4();
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
        //'client_id': uuid
    });


    // Test code to send a message to the shared worker
    function buttonClick(event) {
        event.preventDefault();
        worker.port.postMessage({
            'type': "message",
            'message': 'Sending a message',
            //'client_id': uuid
        });
    }
    document.getElementById('send_button').onclick = buttonClick;

}
