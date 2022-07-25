'use strict';

import *  as puppeteer from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';

export async function getLinks(url) {
    const allHrefs = [];
    for( let i = 0; i < URLSearchParams.length; i++){
        const browser = await puppeteer.launch();
        const [page] = await browser.pages();

        await page.goto(url, {waitUntil: 'networkidle0'});
        await new Promise(resolve => setTimeout(resolve, 3000));

        const elementHandles = await page.$$('a');
        const propertyJsHandles = await Promise.all(elementHandles.map(handle => handle.getProperty('href')));

        const hrefs = await Promise.all(propertyJsHandles.map(handle => handle.jsonValue()));
        if (hrefs === undefined || hrefs.length === 0) {
            const bodyHTML = await page.evaluate(() => document.body.innerHTML);
            console.log('Full DOM of the URL: \n' + bodyHTML + '\n');
          throw new Error('Hrefs not found, please see DOM content above');
     }

        console.log(hrefs);
        await browser.close();
        allHrefs.push(hrefs);
    }
    return [].concat(...allHrefs);
}

export async function checkLinks(links) {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_BROWSER,
        maxConcurrency: 5
    });

    let success = true;

    cluster.on('taskerror', (err, data) => {
        console.error(`Error validating ${data}: ${err.message}`)
        return success = false;
    });

    await cluster.task(async ({ page, data: url}) => {
        const response = await page.goto(url, {waitUntil: 'networkidle0'});
        if (response.status() >= 200 && response.status() < 300){
            console.log('✔️  ' + url + ' ' + response.status());
        } else {
            console.error('❌  ' + url + ' ' + response.status());
            throw new Error('Link failed with invalid response code');
        }
    });

    await Promise.all(links.map(link => cluster.queue(link)));

    await cluster.idle();
    await cluster.close();
    
    return success;
}

export const excludeLinks = (links, unwantedLinks) => {
    for (let i = 0; i < links.length; i++) {
        links = links.filter(val => val !== unwantedLinks[i]);
    }
    return links;
}