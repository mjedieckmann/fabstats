/**
 * Constants and helper functions used in all pages.
 */

import {useEffect} from "react";
import axios from "axios";
import {Chart as ChartJS} from "chart.js";

export const useSimpleDataFetch = (setState, url, key) => {
    useEffect(() => {
        axios.get(url)
            .then(res => {
                let fetched_data = new Set();
                res.data.forEach((data) => {
                    fetched_data.add(data[key]);
                })
                setState([...fetched_data]);
            })
            .catch(err => console.log(err));
    },[setState, url, key]);
}

export const useHeroImagePlugin = () => {
    useEffect(() =>{
        axios.get('/api/heroes')
            .then(res => {
                let heroes = res.data;
                let plugins = {
                    id: 'img_draw',
                    afterDraw: (chart) => {
                        let ctx = chart.ctx;
                        let yAxis = chart.scales['y'];
                        let xAxis = chart.scales['x'];
                        let chart_height = chart.chartArea.height;
                        let y_number = yAxis.ticks.length;
                        let img_height = Math.min(chart_height / y_number, 80);
                        yAxis.ticks.forEach((value, index) => {
                            let y = yAxis.getPixelForTick(index);
                            let src = '';
                            for (let hero of heroes){
                                if (value.label === hero.name){
                                    src = hero.img;
                                    break;
                                }
                            }
                            let image = new Image();
                            image.src = src;
                            ctx.drawImage(image, xAxis.left, y - (img_height / 2), img_height * 0.75, img_height);
                        });
                    }
                };
                ChartJS.register(plugins);
            });
    }, []);
}
