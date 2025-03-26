"use client";

import { useEffect, useState } from "react";
import { Process } from "../../common/types";
import { Container, Button, Row, Col, Table, Form } from "react-bootstrap";
import { get } from "http";
import { error } from "console";

export function ProcessRank() {
    var [processList, setProcessList] = useState<Process[]>([]);
    var [query, setQuery] = useState('');

    var filteredProcessList = processList.filter(process => {
        return process.name.toLowerCase().includes(query.toLowerCase());
    });

    function getProcessRank(): void{
        fetch("http://localhost:8080/rank/cpu-usage")
        .then(response => response.json())
        .then(responseJSON => setProcessList(responseJSON))
        .catch(error => console.error(error));
    }

    function resetProcessRank(): void{
        fetch("http://localhost:8080/rank/reset", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
        .catch(error => console.error(error));

        setProcessList([]);
    }

    useEffect(() => {
        getProcessRank();
    }, []);

    return (
        <Container>
            <Row className="justify-content-center text-center mb-4">
                <Col>
                    <h1>Process Ranking</h1>
                </Col>
            </Row>
            <Row className="justify-content-center text-center mt-4">
                <Col sm={2}>
                    <Button variant="primary" size="lg" type="button" onClick={getProcessRank}>Refresh Ranking</Button>
                </Col>
                <Col sm={2}>
                    <Button variant="danger" size="lg" type="button" onClick={resetProcessRank}>Reset Ranking</Button>
                </Col>
                <Col sm={3}>
                    <Form.Control
                        onChange={input => setQuery(input.target.value)}
                        size="lg"
                        type="search"
                        placeholder="Type Process Name"
                        className="me-2"
                        aria-label="Search"
                    />
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
                            {(filteredProcessList.length > 0) ? (
                                filteredProcessList.map((process: any, index: number) => (
                                    <tr key={index}>
                                        <td>{process.pid}</td>
                                        <td>{process.name}</td>
                                        <td>{process.cpuUsage.toFixed(2)}%</td>
                                        <td>{process.ramUsage.toFixed(2)} MB</td>
                                        <td>{process.diskReadUsage.toFixed(2)} MB/s</td>
                                        <td>{process.diskWriteUsage.toFixed(2)} MB/s</td>
                                    </tr>
                                ))
                            ): (
                                <tr>
                                    <td colSpan={40}>No processes found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}