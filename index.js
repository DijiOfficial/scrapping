const puppeteer = require('puppeteer');
const url = "https://www.chien.com/adresse/8-0-0-21-0-club-d-education-ou-de-sport-canin-belgique-1.php";
const url2 = "https://www.chien.com/adresse/8-0-0-21-0-club-d-education-ou-de-sport-canin-belgique-2.php";//not used yet

const scrap = async (url) => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url);
    
    //first scrapping tests ultimatly useless since we get the name from the next page
    const clubNames = await page.evaluate(() => 
        Array.from(document.querySelectorAll(".margin_bottom_medium.float_left")).map((name) =>
            name.innerHTML.trim()
        )
    );
    //unused info
    // const clubDescription = await page.evaluate(() => 
    //     Array.from(document.querySelectorAll(".text_italic.texte_secondaire.clear")).map((name) =>
    //         name.innerHTML.trim()
    //     )
    // );

    //get the page url
    const clubURLs = await page.evaluate(() => 
        Array.from(document.querySelectorAll("a.flex.lien_bloc")).map((clubURL) =>
            clubURL.href
        )
    );
    console.log(clubURLs);
    await browser.close();
    //scrapping from every url on the page
    scrapContent(clubURLs)
};

const scrapContent = async(urls) => {
    const browser = await puppeteer.launch({headless: true})
	const page = await browser.newPage()
    let clubInfo = [];
    
    for (let i = 0; i < urls.length; i++) {
        club = {}
        await page.goto(urls[i])
        try {
            club.name = await page.evaluate(() => document.querySelector(".font_bold.font_size_big.margin_bottom_big.text_center").innerText.trim())
            
            club.contact = await page.evaluate(() => {
                let generalInfos = document.querySelectorAll("#bloc_31037_content div.flex")
                for (let i = 0; i < generalInfos.length; i++) {
                    if (generalInfos[i].children[0].innerText === 'Téléphone :'){
                        return generalInfos[i].children[1].innerText
                    }
                }
            })

            club.address = await page.evaluate(() => {
                let generalInfos = document.querySelectorAll("#bloc_31037_content div.flex")
                for (let i = 0; i < generalInfos.length; i++) {
                    if (generalInfos[i].children[0].innerText === "Adresse :" || generalInfos[i].children[0].innerText === "Ville :"){
                        return generalInfos[i].children[1].innerText
                    }
                }
            })
                
            club.website = await page.evaluate(() => {
                let generalInfos = document.querySelectorAll("#bloc_31037_content div.flex")
                for (let i = 0; i < generalInfos.length; i++) {
                    if (generalInfos[i].children[0].innerText === "Site :"){
                        return generalInfos[i].children[1].children[0].href
                    }
                }
            })
            clubInfo.push(club);
        } catch (error) {
            console.log(error);
        }
    };
    await browser.close();
    console.log(clubInfo);
}

scrap(url);