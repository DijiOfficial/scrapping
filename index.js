const puppeteer = require('puppeteer');
const url = "https://www.chien.com/adresse/8-0-0-21-0-club-d-education-ou-de-sport-canin-belgique-1.php";
const testURL = "https://www.dofuspourlesnoobs.com/classeacutees-par-succegraves.html";
const url2 = "https://www.chien.com/adresse/8-0-0-21-0-club-d-education-ou-de-sport-canin-belgique-2.php";

var test = [];

const scrap = async (url) => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url);
    
    const clubNames = await page.evaluate(() => 
        Array.from(document.querySelectorAll(".margin_bottom_medium.float_left")).map((name) =>
            name.innerHTML.trim()
        )
    );
    // const clubDescription = await page.evaluate(() => 
    //     Array.from(document.querySelectorAll(".text_italic.texte_secondaire.clear")).map((name) =>
    //         name.innerHTML.trim()
    //     )
    // );
    const clubURLs = await page.evaluate(() => 
        Array.from(document.querySelectorAll("a.flex.lien_bloc")).map((clubURL) =>
            clubURL.href
        )
    );
    // document.querySelectorAll("a.flex.lien_bloc a:not(.affichage_publicite_native_content)")
    console.log(clubURLs);
    await browser.close();
    scrapContent(clubURLs)
};

scrap(url);

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
                let objs = document.querySelectorAll("#bloc_31037_content div.flex")
                for (let i = 0; i < objs.length; i++) {
                    if (objs[i].children[0].innerText === 'Téléphone :'){
                        return objs[i].children[1].innerText
                    }
                }
            })
            club.address = await page.evaluate(() => {
                let objs = document.querySelectorAll("#bloc_31037_content div.flex")
                for (let i = 0; i < objs.length; i++) {
                    if (objs[i].children[0].innerText === "Adresse :" || objs[i].children[0].innerText === "Ville :"){
                        return objs[i].children[1].innerText
                    }
                }
            })
                
            club.website = await page.evaluate(() => {
                let objs = document.querySelectorAll("#bloc_31037_content div.flex")
                for (let i = 0; i < objs.length; i++) {
                    if (objs[i].children[0].innerText === "Site :"){
                        return objs[i].children[1].children[0].href
                        // Array.from(document.querySelectorAll("a.flex.lien_bloc")).map((urlsite) =>
                        //     urlsite.href
                        // )
                        // return document.querySelectorAll("#bloc_31037_content div.flex .flex_1 .a")
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
    // console.log(test);
    // console.log(test[1][1]);
}