import { facetizerId } from './constant';

export default (doc) => {
    return [...doc.querySelectorAll("body > div")].find(e => {
        e.id === facetizerId;
    });
}