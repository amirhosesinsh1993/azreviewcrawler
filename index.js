import puppeteer from 'puppeteer'

const crawler = async (url) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    await page.waitForSelector('.review-text-content')

    // page.on('console', console.log)


    const reviews = await page.evaluate(() => {
        const revsDiv = document.body.querySelectorAll('.review-text-content')
        const reviewInnerText = []
        for(let i = 0; i <= 9; i++)
            reviewInnerText.push(revsDiv[i].innerText)
        return reviewInnerText
    })

    console.log(reviews, reviews.length)


    await browser.close()
}


crawler('https://www.amazon.com/Apple-iPhone-Unlocked-Quad-Core-Smartphone/product-reviews/B01N4R20RS/ref=cm_cr_getr_d_paging_btm_prev_1?ie=UTF8&reviewerType=all_reviews&pageNumber=1')

// review-text-content
// https://www.amazon.com/Apple-iPhone-Unlocked-Quad-Core-Smartphone/product-reviews/B01N4R20RS/ref=cm_cr_getr_d_paging_btm_prev_1?ie=UTF8&reviewerType=all_reviews&pageNumber=1
// https://www.amazon.com/Apple-iPhone-Unlocked-Quad-Core-Smartphone/product-reviews/B01N4R20RS/ref=cm_cr_arp_d_paging_btm_next_2?ie=UTF8&reviewerType=all_reviews&pageNumber=500