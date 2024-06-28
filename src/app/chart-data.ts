export interface ChartData {
    labels: string[];
    datasets: Dataset[];
}


export interface Dataset {
    label: string;
    backgroundColor: string;
    borderColor: string;
    data: number[];
}