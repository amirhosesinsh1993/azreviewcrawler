const { Cluster } = require('puppeteer-cluster');
const fs = require('fs');

(async () => {
    let db = []

    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 3,
        monitor: true,
    })

    // Event handler to be called in case of problems
    cluster.on('taskerror', (err, data) => {
        console.log(`Error crawling ${data}: ${err.message}`)
    })

    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url)
        await page.waitForSelector('.review-text-content')

        const reviews = await page.evaluate(() => {
            return [...document.body.querySelectorAll('.review-text-content')].map(e => e.innerText)
        })

        reviews.forEach(i => db.push(i))
    })

    const basedURL = 'https://www.amazon.com/Apple-iPhone-Totalmente-desbloqueado-Negro/product-reviews/B01N4R20RS/ref=cm_cr_arp_d_paging_btm_next_3?ie=UTF8&pageNumber='

    for (let index = 1; index <= 5; index++) {
        cluster.queue(basedURL + index)
    }

    await cluster.idle()

    // console.log(db)
    console.log(db.length)

    const text = db.map(JSON.stringify)
        .join('\n')
        .replace(/(^\[)|(\]$)/mg, '')

    fs.writeFile('reviews.txt', text, 'utf8', function(err) {
        if (err) {
            console.log('Some error occured - file either not saved or corrupted file saved.');
        } else {
            console.log('It\'s saved!');
        }
    })

    await cluster.close()
})()
