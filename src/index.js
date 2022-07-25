import { expect } from 'chai';
import { getLinks, checkLinks, excludeLinks } from './helper.js';

async function run() {
    try {
        const urlsToCheck = process.env['urlsToCheck'].split(',');
        const excludedUrls = process.env['excludedUrls'].split(',');

        const links = await getLinks(urlsToCheck);
        const newLinks = excludeLinks(links, excludedUrls);
        const check = await checkLinks(newLinks);
        expect(check).to.equal(true);
    }
    catch (error) {
        throw new Error(error);
    }
}
run();