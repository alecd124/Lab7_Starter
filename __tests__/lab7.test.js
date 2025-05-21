describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  it('Initial Home Page – has 20 <product-item> elements', async () => {
    const numProducts = await page.$$eval('product-item', items => items.length);
    expect(numProducts).toBe(20);
  });

  /* -----------------------------------------------------------
     2) Every <product-item> should eventually populate its data
        (title, price, image).  We wait until each component’s
        .data property is filled before checking.
  ------------------------------------------------------------ */
  it(
    'Each <product-item> is populated (title, price, image present)',
    async () => {
      // Wait until every product-item reports populated data
      await page.waitForFunction(() => {
        const items = Array.from(document.querySelectorAll('product-item'));
        return (
          items.length === 20 &&
          items.every(it => {
            const d = it.data;
            return d && d.title && d.price && d.image;
          })
        );
      }, { timeout: 15000 }); // same 15 s budget
  
      // Double-check in Node context
      const allPopulated = await page.$$eval('product-item', items =>
        items.every(it => {
          const d = it.data;
          return d && d.title && d.price && d.image;
        })
      );
      expect(allPopulated).toBe(true);
    },
    16000 // Jest timeout (slightly > waitForFunction budget)
  );

  /* -----------------------------------------------------------
     3) Clicking “Add to Cart” on the first product should toggle
        the button text to “Remove from Cart”.
  ------------------------------------------------------------ */
  it('Clicking “Add to Cart” changes button text to “Remove from Cart”', async () => {
    const firstItem  = await page.$('product-item');
    const shadowRoot = await firstItem.getProperty('shadowRoot');
    const button     = await shadowRoot.$('button');

    await button.click();
    const btnText = await (await button.getProperty('innerText')).jsonValue();
    expect(btnText).toBe('Remove from Cart');
  }, 5000);

  /* -----------------------------------------------------------
     4) After adding every product to the cart, the counter at the
        top-right should read “20”.
  ------------------------------------------------------------ */
  it('Cart count updates to 20 after adding all items', async () => {
    const items = await page.$$('product-item');

    for (const item of items) {
      const shadow = await item.getProperty('shadowRoot');
      const btn    = await shadow.$('button');
      const label  = await (await btn.getProperty('innerText')).jsonValue();
      if (label === 'Add to Cart') await btn.click();
    }

    const count = await page.$eval('#cart-count', el => el.innerText);
    expect(count).toBe('20');
  }, 15000);

  /* -----------------------------------------------------------
     5) Reload the page – the cart should persist (still 20) and
        every button should say “Remove from Cart”.
  ------------------------------------------------------------ */
  it('Cart state persists after reload (20 items remain)', async () => {
    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });

    const items = await page.$$('product-item');
    for (const item of items) {
      const shadow = await item.getProperty('shadowRoot');
      const btnTxt = await (
        await (await shadow.$('button')).getProperty('innerText')
      ).jsonValue();
      expect(btnTxt).toBe('Remove from Cart');
    }

    const count = await page.$eval('#cart-count', el => el.innerText);
    expect(count).toBe('20');
  }, 15000);

  /* -----------------------------------------------------------
     6) localStorage should contain an array with IDs 1-20
  ------------------------------------------------------------ */
  it('localStorage cart array is [1…20] when all items added', async () => {
    const cartLS = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cartLS).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
  });

  /* -----------------------------------------------------------
     7) Remove every item from the cart – counter should read “0”.
  ------------------------------------------------------------ */
  it('Cart count updates to 0 after removing all items', async () => {
    const items = await page.$$('product-item');

    for (const item of items) {
      const shadow = await item.getProperty('shadowRoot');
      const btn    = await shadow.$('button');
      const label  = await (await btn.getProperty('innerText')).jsonValue();
      if (label === 'Remove from Cart') await btn.click();
    }

    const count = await page.$eval('#cart-count', el => el.innerText);
    expect(count).toBe('0');
  }, 15000);

  /* -----------------------------------------------------------
     8) Reload again – buttons should reset to “Add to Cart” and
        counter stays at “0”.
  ------------------------------------------------------------ */
  it('After reload, cart is empty and all buttons say “Add to Cart”', async () => {
    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });

    const items = await page.$$('product-item');
    for (const item of items) {
      const shadow = await item.getProperty('shadowRoot');
      const btnTxt = await (
        await (await shadow.$('button')).getProperty('innerText')
      ).jsonValue();
      expect(btnTxt).toBe('Add to Cart');
    }

    const count = await page.$eval('#cart-count', el => el.innerText);
    expect(count).toBe('0');
  }, 15000);

  /* -----------------------------------------------------------
     9) localStorage should now contain an empty array
  ------------------------------------------------------------ */
  it('localStorage cart array is [] when cart is empty', async () => {
    const cartLS = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cartLS).toBe('[]');
  });
});
