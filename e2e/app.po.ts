import { browser, element, by } from 'protractor';

export class BorderlinePage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('bl-root h1')).getText();
  }
}
