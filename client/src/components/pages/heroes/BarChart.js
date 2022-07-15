import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {useEffect, useState} from "react";
import groupBy from 'lodash.groupby';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
);

export const options = {
    indexAxis: 'y',
    elements: {
        bar: {
            borderWidth: 2,
        },
    },
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: 'Chart.js Horizontal Bar Chart',
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    return context.formattedValue + ' %';
                }
            },
            intersect: false
        }
    },
    scales: {
        x: {
            type: 'linear',
            min: 0,
            max: 100,
            beginAtZero: true
        }
    }
};
/*
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
    labels,
    datasets: [
        {
            // label: 'Dataset 1',
            data: labels.map(() => Math.random()),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        /!*{
            label: 'Dataset 2',
            data: labels.map(() => Math.random()),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },*!/
    ],
};*/

export function BarChart(props) {
    const [ labels, setLabels ] = useState([]);
    const [ barData, setBarData ] = useState([])
    useEffect(() => {
        console.log(props.matches);
        let bar_data = [];
        for (let match of props.matches){
            if (match.hero_winner._id === props.hero._id) {
                if (match.hero_loser.name in bar_data){
                    bar_data[match.hero_loser.name].wins += 1;
                } else {
                    bar_data[match.hero_loser.name] = {wins: 1, losses: 0}
                }
            }
            if (match.hero_loser._id === props.hero._id) {
                if (match.hero_winner.name in bar_data){
                    bar_data[match.hero_winner.name].losses += 1;
                } else {
                    bar_data[match.hero_winner.name] = {wins: 0, losses: 1}
                }
            }
        }
        setBarData(bar_data);
        setLabels(Object.keys(bar_data));
    }, [props.matches]);

    const data = {
        labels,
        datasets:
            [{
                data: labels.map((label) => Math.round(barData[label].wins / (barData[label].wins + barData[label].losses) * 100)),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }]
    };
    return <Bar options={options} data={data} />;
}
