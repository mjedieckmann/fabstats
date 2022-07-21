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
            text: 'Win% by match-up',
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    return context.raw.label;
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

export function BarChart(props) {
    const [ labels, setLabels ] = useState([]);
    const [ barData, setBarData ] = useState([])
    useEffect(() => {
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
    }, [props.matches, props.hero._id]);

    const data = {
        labels,
        datasets:
            [{
                data: labels.map((label) => {
                    return {
                        x: Math.round(barData[label].wins / (barData[label].wins + barData[label].losses) * 100),
                        y: label,
                        label: Math.round(barData[label].wins / (barData[label].wins + barData[label].losses) * 100) + "% (" + barData[label].wins + "/" + (barData[label].wins + barData[label].losses) + ")"
                    }
                }),
                borderColor: 'rgb(0,191,255, 0.9)',
                backgroundColor: 'rgba(0,191,255, 0.5)',
            }]
    };
    return <Bar options={options} data={data} />;
}
