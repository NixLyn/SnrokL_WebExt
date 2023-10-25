

    /* Using: file:///home/dillon/CURRENT/RedNode/SOCK_JS_TEST/test_.html */
    /*
    ToDo:
        -Create Connection Switch (On/Off)
        -Link Switch
        -Display Status
        -Send Msgs
            -Input:'post'
        -Recv Msgs
            -Display:'get'
    */

    /* Now we need an eventListener,
        -Which behaves like a while loop (for you py_devs)
     */
        document.addEventListener('DOMContentLoaded', function () {
            /* Let's make some variables linked to the html
                so that we can see what we're doing
                I don't like going in blindly.
                - 'connection-status'
                - 'current-cmd'
                - 'data-returned'
                - 'cmd-to-send'
                - 'send-button'
             */
            /* We put them inside the 'eventListener' so that they get updated correctly */
            const conn_status = document.querySelector('[name=connection-status]');
            const current_cmd = document.querySelector('[name=current-cmd]');
            const data_return = document.querySelector('[name=data-returned]');
            const cmd_to_send = document.querySelector('[name=cmd-to-send]');
            const send_button = document.querySelector('[name=send-button]');
            const back_logmsg = document.querySelector('#back-log');
            
            /* We'll need a containers to hold some stacks of data from the node.. */
            var view_rules_data = "";
            let view_rules_container = document.querySelector('.rules-view');
            const update_rules = document.querySelector("#update-rules");
            var rules_open = false;
    
            update_rules.addEventListener("click", function(){

                console.log("Clicked: Update-Rules");
                // Check that the button works first..
                let new_rules = view_rules_container.innerHTML;
                let toMsg = "node update rules.txt " + new_rules;
                console.log(toMsg);
                websocketClient.send(toMsg);
                // Send CMD to Node
            });



            console.log('[EventListener]:[Running]');
            /* Establish Connection */
            const websocketClient = new WebSocket("ws://localhost:12345");
            /* Once the connection has be 'opened' */
            websocketClient.onopen = function () {
                /* Send an init msg... good ol' "Hello World!" */
                websocketClient.send('[CONN_REQ]');
    
                /* We can log the new status */
                console.log('[CONNECTION ESTABLISHED]');
    
                /* and we can also display the STATUS on the screen */
                conn_status.value = "CONNECTED!";
                /* even change the color of the background.. 
                    - Already getting side tracked*/
                conn_status.style.backgroundColor = 'rgb(0, 255, 0)';
                /* And.. for the whole point of it:  */
    
                                /*
                        We would also like to add buttons to simplify shit..
                    */
                document.getElementById("run-snrokl").addEventListener("click", function(){
                    console.log("Clicked: run-snrokl");
                    // Check that the button works first..
                    websocketClient.send("node run rules.txt vsbr");
                    // Send CMD to Node
                });
                document.getElementById("get-stack").addEventListener("click", function(){
                    console.log("Clicked: get-stack");
                    // Check that the button works first..
                    websocketClient.send("get-stack DATA");
                    // Send CMD to Node
                });



                document.getElementById("view-rules").addEventListener("click", function(){
                    if (rules_open == false)
                    {
                        console.log("\n---------------\nClicked: run-snrokl");
                        websocketClient.send("node get-file rules.txt");    
                        rules_open = true;
                        view_rules_container.nodeType = "input";
                        // Update "RULES.TXT"
                        update_rules.style.display = "block";

                    }
    
                    else
                    {
                        view_rules_container.style.display = "none";
                        console.log("Clicked: run-snrokl");
                        rules_open = false;
                    }
    
                });
                document.getElementById("live-stream").addEventListener("click", function(){
                    console.log("Clicked: live-stream");
                    websocketClient.send("node live-stream");
                });
                /*
                    I Just got annoyed with not using "ENTER"-key as the "SEND"...
                */
                var input = document.getElementById("text-input");
                input.addEventListener("keyup", function(event){
                    if (event.keyCode === 13){
                        event.preventDefault();
                        document.getElementById("snd-btn").click();
                        console.log('[Sending..]');
                        websocketClient.send(cmd_to_send.value);
                        //current_cmd.value =  "_"; // cmd_to_send;
                        /*
                        Add some slight AutoScroll:
                        */
                        back_logmsg.scrollTop = back_logmsg.scrollTop + back_logmsg.scrollHeight;
                        console.log(back_logmsg.scrollTop);
                    }
    
                });
    
    
                /* Using the 'send-button' as a trigger: we can send the value of 'current-cmd' */
                //send_button.onclick = function () {
                //    console.log('[Sending..]');
                //    websocketClient.send(cmd_to_send.value);
                //    current_cmd.value = cmd_to_send;
                //    /* We can now send Messages to the PySocketServer */
                //};
    
    
                /* Now we must await the return.. 
                and display on the user-screen */
                //data_return.nodeValue = 
    
    
    
            };
    
            /* But we will require Data-Returned 
                - This function can actually be put outside
                    the 'onopen' function, incase of connection
                    problems. But, for safety, let's keep it in here
            */
            websocketClient.onmessage = function (msg) {
                /* Print on console */
                console.log('[RETURNED]:', msg);
                /* and Display to the screen for the user */
                data_return.value = msg.data;
                /* We can also 'back-log' the messages:
                    Creating a new element inside the 'back-log'
                    container and appendingChild with the msg data
                 */
                 let toSreach = msg.data;
                 if (toSreach.includes("RULES.TXT")){
                    console.log("\n RULES!! \n", toSreach);
                    // Add to container.. 
                    view_rules_data = toSreach;
                    view_rules_container.style.display = "block";
                    view_rules_container.innerHTML = view_rules_data;
    
                 }
                 else{
                    const new_log = document.createElement('div');
                    new_log.innerHTML = msg.data+"<br>";
                    back_logmsg.appendChild(new_log);
                 }
    
            };
    
    
    
            websocketClient.send('[DIS_CONN]');
        }, false);
    
    