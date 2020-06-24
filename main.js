
fetch('https://api.covid19india.org/v3/data-all.json')
// fetch('./data.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        let confirmed = totalify(data);
        renderChart(confirmed);
        let per = perfy(data);
        renderPer(per);
    })

function totalify(data) {
    let confirmed = [], recovered = [], deceased = [], active = [];
    for (const key in data) {
        // console.log(key);
        // console.log(data[key]["TT"]["total"]["confirmed"]);
        confirmed.push({
            x: key,
            y: data[key]["TT"]["total"]["confirmed"] || 0
        });
        recovered.push({
            x: key,
            y: data[key]["TT"]["total"]["recovered"] || 0
        });
        deceased.push({
            x: key,
            y: data[key]["TT"]["total"]["deceased"] || 0
        });
        active.push({
            x: key,
            y: (data[key]["TT"]["total"]["confirmed"] || 0) - (data[key]["TT"]["total"]["recovered"] || 0) - (data[key]["TT"]["total"]["deceased"] || 0)
        })
    }
    return [
        {
            name: "Confirmed",
            points: confirmed
        },
        {
            name: "Active",
            points: active
        },
        {
            name: "Recovered",
            points: recovered
        },
        {
            name: "Deceased",
            points: deceased
        }

    ];
}

function perfy(data) {
    let confirmed = 0, recovered = 0, deceased = 0, active = 0;
    let active_per = [], recovered_per = [], closed_per = [];
    for (const key in data) {
        confirmed = data[key]["TT"]["total"]["confirmed"] || 0
        recovered = data[key]["TT"]["total"]["recovered"] || 0
        deceased = data[key]["TT"]["total"]["deceased"] || 0
        active = confirmed - recovered - deceased
        active_per.push({
            x: key,
            y: (active / confirmed * 100)
        });
        recovered_per.push({
            x: key,
            y: (recovered / confirmed * 100)
        });

        closed_per.push({
            x: key,
            y: ((recovered + deceased) / confirmed * 100)
        });
    }
    console.table(confirmed, active, recovered + deceased, recovered, deceased)
    return [
        {
            name: 'Active',
            points: active_per
        },
        {
            name: 'Recovered',
            points: recovered_per
        },
        {
            name: 'Closed',
            points: closed_per
        }
    ];
}

function renderChart(series) {
    JSC.Chart('chartDiv', {
        title_label_text: "Covid Data",
        legend_template: '%icon,%name',
        series: series
    });
}

function renderPer(series) {
    JSC.Chart('chartDiv_2', {
        title_label_text: "Covid Data",
        legend_template: '%icon,%name',
        series: series
    });
}