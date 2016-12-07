import { BorderlinePage } from './app.po';

describe('borderline App', function() {
  let page: BorderlinePage;

  beforeEach(() => {
    page = new BorderlinePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('bl works!');
  });
});
