import { Ng2ManiaplanetStylePage } from './app.po';

describe('ng2-maniaplanet-style App', function() {
  let page: Ng2ManiaplanetStylePage;

  beforeEach(() => {
    page = new Ng2ManiaplanetStylePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
