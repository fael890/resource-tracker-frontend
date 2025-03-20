export interface Process {
    pid: number,
    name: string;
    cpuUsage: number;
    ramUsage: number;
    diskReadUsage: number;
    diskWriteUsage: number;
}

export interface GpuMonitor {
    gpuUsage: string;
    vramUsage: string;
    totalVram: string;
    temperature: string;
}