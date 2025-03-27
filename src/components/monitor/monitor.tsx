"use client"

import './monitor.css'

import { useEffect, useState } from "react";
import { Container, Button, Row, Col, Table } from "react-bootstrap";
import { Client } from "@stomp/stompjs";
import { Process, GpuMonitor } from '@/common/types';
import { WebSocketService } from './webSocketConnection';

export function ProcessMonitor() {
    var [processList, setProcessList] = useState<Process[]>([]);
    var [timestamp, setTimestamp] = useState('');
    var [gpuData, setGpuUsage] = useState<GpuMonitor>({
        gpuUsage: '',
        vramUsage: '',
        totalVram: '',
        temperature: ''
    });

    function handleWebSocketMessage(data: any){
        setProcessList(data.processList);
        setGpuUsage(data.gpuMonitor);

        let timestamp: Date = new Date(data.timestamp);
        setTimestamp(timestamp.toLocaleString());
    }

    function connect(){
        WebSocketService.connect(handleWebSocketMessage);
    }

    function disconnect() {
        WebSocketService.disconnect();
    }
    
    return (
        <Container>
            <Row className="justify-content-center text-center">
                <Col>
                    <h1>Resource Tracker</h1>
                </Col>
            </Row>
            <Row className="justify-content-center text-center mt-6">
                <Col>
                    <h3>Process List</h3>
                </Col>
            </Row>
            <Row className="justify-content-center text-center mt-2">
                <Col sm={2}>
                    <Button variant="primary" size="lg" id="connect" type="button" onClick={connect}>Start Monitoring</Button>
                </Col>
                <Col sm={2}>
                    <Button variant="danger" size="lg" id="disconnect" type="button" onClick={disconnect}>Stop Monitoring</Button>
                </Col>
                <Col sm={6}>
                    <h3>Verification time: ({timestamp})</h3>
                </Col>
            </Row>
            <Row className="justify-content-center text-center mt-2">
                <Col>
                    <Table>
                        <thead>
                            <tr>
                                <th>PID</th>
                                <th>Name</th>
                                <th>CPU Usage (%)</th>
                                <th>RAM Usage (MB)</th>
                                <th>Disk Read (MB/s)</th>
                                <th>Disk Write (MB/s)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processList && processList.length > 0 ? (
                                processList.map((process: any, index: number) => (
                                    <tr key={index}>
                                        <td>{process.pid}</td>
                                        <td>{process.name}</td>
                                        <td>{process.cpuUsage.toFixed(2)}%</td>
                                        <td>{process.ramUsage.toFixed(2)} MB</td>
                                        <td>{process.diskReadUsage.toFixed(2)} MB/s</td>
                                        <td>{process.diskWriteUsage.toFixed(2)} MB/s</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={12}>No processes found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row className="justify-content-center text-center mt-6">
                <Col>
                    <h3>GPU Usage</h3>
                </Col>
            </Row>
            <Row className="justify-content-center text-center mt-2">
                <Col>
                    <Table>
                        <thead>
                            <tr>
                                <th>GPU Usage (%)</th> 
                                <th>Used Memory (MiB)</th>
                                <th>Total Memory (MiB)</th>
                                <th>Temperature</th>
                            </tr>
                        </thead>
                        <tbody>
                            { gpuData.gpuUsage !== '' ? (
                                <tr>
                                    <td>{gpuData.gpuUsage}</td>
                                    <td>{gpuData.vramUsage}</td>
                                    <td>{gpuData.totalVram}</td>
                                    <td>{gpuData.temperature}</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan={40}>No gpu information</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}