import { SESVideoScanner2Page } from './app.po';

describe('sesvideo-scanner2 App', () => {
  let page: SESVideoScanner2Page;

  beforeEach(() => {
    page = new SESVideoScanner2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
