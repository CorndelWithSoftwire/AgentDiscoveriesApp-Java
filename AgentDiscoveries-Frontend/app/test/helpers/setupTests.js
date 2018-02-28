import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const jsdom = require('jsdom');

const {JSDOM} = jsdom;
configure({adapter: new Adapter()});

const exposedProperties = ['window', 'navigator', 'document'];
const {document} = (new JSDOM('')).window;
global.document = document;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};
