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
import {useHeroImagePlugin} from "../_pageUtils";

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
    layout: {
      padding: {
          left: 60
      }
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
        },
        y: {
            ticks :{
                display: false,
            }
        }
    }
};
export function SummaryChart(props) {
    const [ labels, setLabels ] = useState([]);
    const [ barData, setBarData ] = useState([]);

    useEffect(() => {
        let bar_data = [];
        for (let match of props.matches){
            if (match.hero_winner._id === match.hero_loser._id){
                continue;
            }
            if (match.hero_loser.name in bar_data){
                bar_data[match.hero_loser.name].matches += 1;
            } else {
                bar_data[match.hero_loser.name] = {wins: 0, matches: 1}
            }
            if (match.hero_winner.name in bar_data){
                bar_data[match.hero_winner.name].wins += 1;
                bar_data[match.hero_winner.name].matches += 1;
            } else {
                bar_data[match.hero_winner.name] = {wins: 1, matches: 1}
            }
        }
        let sortable = [];
        for (let hero in bar_data) {
            sortable.push([hero, bar_data[hero]]);
        }
        sortable.sort(function (a, b) {
            let a_percent = a[1].wins / a[1].matches;
            let b_percent = b[1].wins / b[1].matches;
            if (a_percent > b_percent){
                return -1;
            } else if (a_percent < b_percent){
                return 1;
            }
            return 0;
        });
        let labels = [];
        for (let hero of sortable){
            labels.push(hero[0]);
        }
        setBarData(sortable);
        setLabels(labels);
    }, [props.matches]);

    useHeroImagePlugin();

    const data = {
        labels,
        datasets:
            [{
                data: labels.map((label, index) => {
                    return {
                        x: Math.round(barData[index][1].wins / barData[index][1].matches * 100),
                        y: label,
                        label: Math.round(barData[index][1].wins / barData[index][1].matches * 100) + "% (" + barData[index][1].wins + "/" + barData[index][1].matches + ")"
                    }
                }),
                borderColor: 'rgb(0,191,255, 0.9)',
                backgroundColor: 'rgba(0,191,255, 0.5)',
            }]
    };
    return <Bar options={options} data={data}/>;
}
