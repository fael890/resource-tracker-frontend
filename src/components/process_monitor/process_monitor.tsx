"use client"

import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

export function ProcessMonitor() {
    var [processList, setProcessList] = useState<Process[]>([]);
    var [timestamp, setTimestamp] = useState('');
    var [gpuUsage, setGpuUsage] = useState('');
    const stompClient = new Client(
        { brokerURL: 'ws://localhost:8080/connection' }
    );

    interface Process {
        name: string;
        cpuUsage: number;
        ramUsage: number;
        diskReadUsage: number;
        diskWriteUsage: number;
    }
    
    stompClient.onConnect = (frame) => {
        //setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/process', (message) => {
            console.log("Aqui");
            let processListJSON = JSON.parse(message.body);

            setProcessList(JSON.parse(message.body) as any);
            setTimestamp(processListJSON[0].timestamp);
            setGpuUsage(processListJSON[0].gpuUsage);
        });
    };
    
    function startMonitoring() {
        stompClient.publish({
            destination: "/app/process",
            body: "test"
        });
    } 
    
    function connect() {
        stompClient.activate();
    }
    
    function disconnect() {
        stompClient.deactivate();
        //setConnected(false);
        console.log("Disconnected");
    }
    
    // $(function () {
    //     $("form").on('submit', (e) => e.preventDefault());
    //     $( "#connect" ).click(() => connect());
    //     $( "#disconnect" ).click(() => disconnect());
    //     $( "#monitoring" ).click(() => startMonitoring());
    // });

    return (
        <div id="main-content" className="container">
            <div>
                <div>
                    <form>
                        <div>
                            <label htmlFor="connect">WebSocket connection:</label>
                            <button id="connect" type="button" onClick={connect}>Connect</button>
                            <button id="disconnect" type="button" onClick={disconnect}>Disconnect</button>
                        </div>
                    </form>
                </div>
            </div>
            <h2>Process List({timestamp}):</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>CPU Usage (%)</th>
                        <th>RAM Usage (MB)</th>
                        <th>Disk Read (MB/s)</th>
                        <th>Disk Write (MB/s)</th>
                    </tr>
                </thead>
                <tbody>
                    {processList.length > 0 ? (
                        processList.map((process, index) => (
                            <tr key={index}>
                                <td>{process.name}</td>
                                <td>{process.cpuUsage}%</td>
                                <td>{process.ramUsage} MB</td>
                                <td>{process.diskReadUsage} MB/s</td>
                                <td>{process.diskWriteUsage} MB/s</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td>No processes found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <h2>GPU Usage({gpuUsage}):</h2>
        </div>
    )
}