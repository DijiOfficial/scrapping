const puppeteer = require('puppeteer');

const mainUrl = "https://www.apdt-bene.net/vind-een-trainer/"

const getTrainers = async (url) => {
    const browser = await puppeteer.launch({ headless: true, args: ["--disable-notifications"] })
    const page = await browser.newPage()

    await page.goto(url)

    const getData = async () => {
        const listOfTrainers = await page.evaluate(() =>
            Array.from(document.querySelectorAll("#wpsl-stores li")).map((listItem) => {
                let trainer = {}
                trainer.name = listItem.firstElementChild.firstElementChild.innerText
                trainer.adress = {
                    street: listItem.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.innerText,
                    city: listItem.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.innerText,
                    country: listItem.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerText
                }
                trainer.contactInfo = listItem.firstElementChild.lastElementChild.innerText

                return trainer
            })
        )
        const fixData = async (list) => {
            list.forEach(trainer => {
                let trainerInfos = trainer.contactInfo.split("\n")
                trainerInfos.forEach(contactDetail => {
                    if (contactDetail.includes("Telefoon")) {
                        trainer.phone = contactDetail.replace('Telefoon', '');
                    }
                    else if (contactDetail.includes("E-mail")) {
                        trainer.email = contactDetail.replace('E-mail', '');
                    }
                    else {
                        trainer.website = contactDetail.replace('Website', '');
                    }
                });
                delete trainer.contactInfo
            });

            console.log(list)
        }
        await fixData(listOfTrainers)
        //console.log(listOfTrainers)
    }

    await page.waitForTimeout(5000);
    await getData()
    await browser.close()
}

getTrainers(mainUrl)

