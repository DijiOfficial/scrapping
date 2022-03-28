const puppeteer = require('puppeteer');

const mainUrl = "https://www.chien.com/adresse/10-0-0-0-0-educateur-dresseur-canin-1.php"

const getURLs = async (url) => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(url)

    const URLS = await page.evaluate(() =>
        Array.from(document.querySelectorAll("#bloc_31107 a.lien_bloc:not(.affichage_publicite_native_content)")).map((linkItem) => {
            let links = {}
            links.url = linkItem.href
            return links
        }
        ))
    scrapTrainerInfo(URLS)
    await browser.close()
}

const scrapTrainerInfo = async (urlArray) => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    let trainerArray = []

    for (let index = 0; index < urlArray.length; index++) {
        await page.goto(urlArray[index].url)

        trainer = {}
        trainer.name = await page.evaluate(() => document.querySelector('h1').innerText)
        trainer.description = await page.evaluate(() => document.querySelector(".adresse_introduction").innerText)
        trainer.contactInfo = await page.evaluate(() => document.querySelector("#bloc_31037_content").innerText)
        trainerArray.push(trainer)
    }
    await browser.close()

    trainerArray.forEach(trainer => {
        let newDescription = trainer.description.replace(/\n/g, ' ');
        trainer.description = newDescription
        let contactArray = trainer.contactInfo.split("\n")
        for (let i = 0; i < contactArray.length; i++) {

            if (contactArray[i].includes("Téléphone")) {
                trainer.phone = contactArray[i + 1]
            }
            else if (contactArray[i].includes("Site")) {
                trainer.website = contactArray[i + 1]
            }
            else if (contactArray[i].includes("Adresse")) {
                trainer.adress = {}
                trainer.adress.street = contactArray[i + 1]
                trainer.adress.city = contactArray[i + 2]
                trainer.adress.country = contactArray[i + 3]
            }
        }
        delete trainer.contactInfo
    });
    console.log(trainerArray)

}



getURLs(mainUrl)