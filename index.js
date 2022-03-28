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
        // const clubInfoList = await page.evaluate(() => document.querySelectorAll("#bloc_31037_content div.flex div.flex_1"))
        try {
            club.name = await page.evaluate(() => document.querySelector(".font_bold.font_size_big.margin_bottom_big.text_center").innerText.trim())
            // club.contact = await page.evaluate(() => document.querySelectorAll("#bloc_31037_content div.flex div.flex_1")[2].innerText.trim())

            let info = await page.evaluate(() => document.querySelectorAll("#bloc_31037_content div.flex"))
            let list = await page.$$('#bloc_31037_content div.flex');
            
            let infos = await page.evaluate(() => Array.from(document.querySelectorAll("#bloc_31037_content div.flex")))

            // await this.page.evaluate(() => {
            //     let elements = Array.from(document.querySelectorAll("#bloc_31037_content div.flex"));
            //     let links = elements.map(element => {
            //         return element.children[0]
            //     })
            //     return links;
            // });

            // console.log(list);
            // console.log(list.children);
            // console.log(links);
            console.log(info);
            console.log(infos);
            // console.log(info[0].value);
            // console.log(Array.from(info).length);
            // for (let i = 0; i < info.length; i++) {
            //     console.log(info[i]);
            // }
            // info.forEach(el => {
            //     console.log(el.children);
            // });
            // test.push(info)
            // await page.evaluate(() => {
            //     let info = Array.from(document.querySelectorAll("#bloc_31037_content div.flex"))
            //     let testFunction = (infos) => {
            //         infos.forEach(el => {
            //             console.log(el);
            //         });
            //     }
            //     testFunction(info)
            //     // .forEach(el => {
            //         // if (el.children[0].innerText = "Adresse :") {
            //             //     console.log("you found the adress");
            //         // }
            //         // console.log(el);
            //         // club.location = el
            //     // })
            // })
                
            // club.website = await page.evaluate(() => document.querySelectorAll("#bloc_31037_content div.flex div.flex_1 a")[1].href)
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