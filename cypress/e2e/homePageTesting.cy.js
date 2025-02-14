describe("homepage verification",()=>{
    beforeEach(()=>{
        cy.visit("https://www.automationexercise.com/");
        cy.url().should('eq',"https://www.automationexercise.com/");
        cy.addStylesheet('disable-animations.css', `
          .modal.fade { transition: none !important; }
          .product-overlay { opacity: 1 !important; }
        `);
    });

    // before(()=>{
    //   cy.addStylesheet('disable-animations.css', `
    //     .modal.fade { transition: none !important; }
    //     .product-overlay { opacity: 1 !important; }
    //   `);
    // })

    it("verify website logo",()=>{
       // cy.wait(10000);
        //cy.get("a>img")
        //<img src="/static/images/home/logo.png" alt="Website for automation practice" xpath="1">
        cy.get('img[src="/static/images/home/logo.png"]') //get the image element
        .should("have.attr","alt","Website for automation practice") //verify 'alt' attribute
        .should("be.visible") //check if the image is visble
        //.should("have.attr","css","1"); //verify the css attribute
    });
    it("verify the nav bar menu names",()=>{
        const expectedMenuNames =["Home","Products","Cart","Signup / Login","Test Cases","API Testing","Video Tutorials","Contact us"];
        cy.get(".shop-menu ul.nav > li > a").each(($el,index)=>{
            const menuName = $el.text().replace(/[^\w\s/]/g, "").trim();
            expect(menuName).to.eq(expectedMenuNames[index]);
            // cy.log(menuName);
            cy.log(`Menu ${index + 1}: ${menuName}`);
            //cy.log(`Raw text: "${$el.text()}"`);
            

        });
        
    });

    it("verify the carousel items and indicators",()=>{
        cy.get("#slider-carousel ol>li").then(($indicators)=>{
            const numOfIndicators = $indicators.length;
            cy.log(`Number of carousel indicators: ${numOfIndicators}`);
            cy.get('[data-slide-to]').should("have.length", numOfIndicators);

        });

    });

    it("Verify only one carousel is active at a time",()=>{
        cy.get('.carousel-indicators>[data-target="#slider-carousel"]').should("have.class","active");
    });

    it("Verify next and prev click on carousel",()=>{
        cy.get(".left.control-carousel").click();
        cy.get(".right.control-carousel").click();

    })
    
    it("verify that carousel auto slides",()=>{
        //capture the active slide first
        cy.get('[data-slide-to].active').as("initialActiveSlide");
        const autoSlideDuration = 3000;
        cy.wait(autoSlideDuration)
        cy.get("@initialActiveSlide").invoke("index").then((initalIndex) =>{
            cy.get('[data-slide-to].active').invoke("index").should("not.eq",initalIndex)
        })

    });

    
    it("verify",()=>{
        cy.get("#slider-carousel>.carousel-inner>div").each(($el,index,$list)=>{
            cy.log($el[index]);
            cy.wrap($el).find("h1").should("have.text","AutomationExercise");
            cy.wrap($el).find("h2").contains("Full-Fledged practice website for Automation Engineers");
            cy.wrap($el).find("p").contains("All QA engineers can use this website for automation practice and API testing either they are at beginner or advance level. This is for everybody to help them brush up their automation skills.");
            cy.wrap($el).find("button").contains("Test Cases");
            cy.wrap($el).find("button").contains("APIs list for practice");
            //verify the image source dynamically based on index value
            const imgSrc =["/static/images/home/girl2.jpg","/static/images/home/girl1.jpg","/static/images/home/girl3.jpg"]
            cy.wrap($el).find("img").should("have.attr","src",imgSrc[index]);
        })
    })

    it("verify button navigation of carousel slides", () => {
        // Get all buttons upfront and track their count
        cy.get('div.col-sm-6 a[href="/test_cases"]')
          .find("button:contains('Test Cases')")
          .its("length")
          .then((count) => {
            // Iterate over each button by index
            for (let index = 0; index < count; index++) {
              // Re-query the DOM for fresh elements after each navigation
              cy.get('div.col-sm-6 a[href="/test_cases"]')
                .find("button:contains('Test Cases')")
                .eq(index) // Use index to target the nth button
                .click({force:true});
      
              // Verify URL
              cy.url().should("eq", "https://www.automationexercise.com/test_cases");
      
              // Navigate back
              cy.go("back");
      
              // Optional: Wait for the page to stabilize after navigation
              cy.get("body").should("be.visible");
            }
          });
      });

    it("verify the advertisement section",()=>{
        //verify that advertise dom existes in the page and should be visible to the user
        cy.get(".google-auto-placed").should("exist").and("be.visible");
        //Verify advertisement status
        cy.get(".google-auto-placed ins").should("have.attr","data-ad-status","unfilled");
        
    })

    it("Verify that homepage contains category section",()=>{
        cy.get(".left-sidebar > :nth-child(1)").contains("Category");
        //verify category names
        cy.get(".category-products h4.panel-title").each(($el,index)=>{
            
            //extract the category names into text
            const categoryName = $el.text().trim().replace(/[^\w\s/]/g, "");
            cy.log(categoryName);
            const expectedCategoriesName =["Women","Men","Kids"];
            expect(categoryName).to.equal(expectedCategoriesName[index]);
            //cy.wrap($el).find(".panel-heading>.panel-title a").click();
        })

        //Verify panel is collapsed by default
        cy.get(".panel-collapse").each(($pnl)=>{
            cy.wrap($pnl).should("have.class","collapse");

        })
        
        // Test data structure
        const panelExpectations = {
            Women: ['Dress', 'Tops', 'Saree'],
            Men: ['Tshirts', 'Jeans'],
            Kids: ['Dress', 'Tops & Shirts']
         };
        
        //Expand each panel
        cy.get(".panel-title a").each(($panelHeader) => {
            // Get the panel title text
            const panelTitle = $panelHeader.text().trim();
        
            // Click the panel header to expand it
            cy.wrap($panelHeader).click().should('not.have.class', 'collapsed');
        
            // Target the expanded panel body using the proper parent-child relationship
            cy.wrap($panelHeader)
                .parents(".panel-default")
                .find(".panel-collapse.in")
                .should("be.visible")
                .within(() => {
                    // Get all the panel items and assert their text
                    cy.get('a').should($items => {
                        const actual = Cypress._.map($items, el => 
                            el.textContent // Use textContent instead of innerText
                                .trim()
                                .toLowerCase()
                                .replace(/\s+/g, ' ') // Normalize whitespace
                        );
        
                        const expected = panelExpectations[panelTitle]
                            .map(item => item.toLowerCase().trim());
        
                        // Assert array contents match
                        expect(actual).to.deep.equal(expected);
        
            })

            })
            //close panel after verification
            cy.wrap($panelHeader).click();
        })


        //verify panel is expanded when clicking on +icon
        cy.get(".badge").each(($plusIcon)=>{
            cy.wrap($plusIcon).click();
            cy.wrap($plusIcon)
            .parents('.panel-title')
            .should("not.have.class","collapsed")
            //collapse the panel again
            cy.wrap($plusIcon).click();
        })
})

//Verify when one panel is expanded and user expands the other panel the earlier expanded panel gets collapsed
        
          
it('verifies panel expansion/collapse', () => {
    cy.get(".panel-title a").each(($header, index, $headers) => {
      // 1. Click the current panel header
      cy.wrap($header)
        .click()
        // Verify header state changes IMMEDIATELY after click
        .should('not.have.class', 'collapsed');

      // 2. Verify current panel expands
      cy.wrap($header)
        .parents('.panel-default')
        .find('.panel-collapse')
        .should('have.class', 'in') // For Bootstrap 3/4
        .and('be.visible');

      // 3. Click the NEXT panel header (if exists)
      const nextIndex = (index + 1) % $headers.length;
      if (nextIndex !== index) { // Avoid infinite loop for single panel
        cy.wrap($headers[nextIndex]).click();

        // 4. Verify NEW panel expands first
        cy.wrap($headers[nextIndex])
          .should('not.have.class', 'collapsed')
          .parents('.panel-default')
          .find('.panel-collapse')
          .should('have.class', 'in')
          .and('be.visible');

        // 5. Verify ORIGINAL panel collapses
        cy.wrap($header)
          .should('have.class', 'collapsed') // Correct assertion
          .parents('.panel-default')
          .find('.panel-collapse')
          .should('not.have.class', 'in')
          .and('not.be.visible');
      }
    });
  });

  it("Verify panel item Navigation", () => {
    // Store the base URL for navigation
    const baseUrl = "https://www.automationexercise.com";
  
    // First, expand the Women panel
    cy.get('h4.panel-title > a[href="#Women"]').click();
    cy.get('#Women.panel-collapse').should('have.class', 'in');
  
    // Get all items and convert to array to maintain reference
    cy.get('#Women .panel-body ul > li a').then(($items) => {
      const items = Cypress._.map($items, (item) => ({
        element: item,
        text: item.innerText.trim(),
        href: item.getAttribute('href')
        
      }));

      cy.log(JSON.stringify(items));
  
      // Use traditional loop instead of each() to control execution flow
      for (let index = 0; index < items.length; index++) {
        // Re-query the panel each time to ensure DOM stability
        cy.get('#Women .panel-body ul > li a').eq(index).then(($item) => {
          cy.wrap($item).click();
          
          // Verify URL using the stored href
          cy.url().should('eq', baseUrl + items[index].href);
          
          // Navigate back and re-establish panel state
          cy.go('back');
          
          // Re-expand panel if needed after navigation
          cy.get('#Women.panel-collapse').then(($panel) => {
            if (!$panel.hasClass('in')) {
              cy.get('h4.panel-title > a[href="#Women"]').click();
            }
          });
        });
      }  
    });

    //Expand the Men panel
    cy.get("h4.panel-title > a[href='#Men']").click();
    cy.get("#Men.panel-collapse").should('have.class', 'in');

    //Get all the items of Men panel to maintain the reference
    cy.get('#Men .panel-body ul > li a').then(($items1) =>{
        const items1 = Cypress._.map($items1, (item) => ({
            element: item,
            text: item.innerText.trim(),
            href: item.getAttribute('href')
            
          }));

          cy.log(JSON.stringify(items1));
          
          //Use for loop to iterate through Men panel items
          for (let index = 0; index < items1.length; index++) {
            // Re-query the panel each time to ensure DOM stability
            cy.get('#Men .panel-body ul > li a').eq(index).then(($item) => {
              cy.wrap($item).click();
              
              // Verify URL using the stored href
              cy.url().should('eq', baseUrl + items1[index].href);
              
              // Navigate back and re-establish panel state
              cy.go('back');
              
              // Re-expand panel if needed after navigation
              cy.get('#Men.panel-collapse').then(($panel) => {
                if (!$panel.hasClass('in')) {
                  cy.get('h4.panel-title > a[href="#Men"]').click();
                }
              });
            });
          }  

    })

    //Expand the Kids panel
    cy.get("h4.panel-title > a[href='#Kids']").click();
    cy.get("#Kids.panel-collapse").should('have.class', 'in');

    //Get all the items of Men panel to maintain the reference
    cy.get('#Kids .panel-body ul > li a').then(($items2) =>{
        const items2 = Cypress._.map($items2, (item) => ({
            element: item,
            text: item.innerText.trim(),
            href: item.getAttribute('href')
            
          }));

          cy.log(JSON.stringify(items2));
          
          //Use for loop to iterate through Men panel items
          for (let index = 0; index < items2.length; index++) {
            // Re-query the panel each time to ensure DOM stability
            cy.get('#Kids .panel-body ul > li a').eq(index).then(($item) => {
              cy.wrap($item).click();
              
              // Verify URL using the stored href
              cy.url().should('eq', baseUrl + items2[index].href);
              
              // Navigate back and re-establish panel state
              cy.go('back');
              
              // Re-expand panel if needed after navigation
              cy.get('#Kids.panel-collapse').then(($panel) => {
                if (!$panel.hasClass('in')) {
                  cy.get('h4.panel-title > a[href="#Kids"]').click();
                }
              });
            });
          }  

    })

    
  });

  //Verify Brands section
  it("Verify Title of Brands Section and brandNames along with product count",()=>{
    
    //create a hasmap to reference the data
    const expectedBrands = {
      'Polo': 6,
      'H&M': 5,
      'Madame': 5,
      'Mast & Harbour': 3,
      'Babyhug': 4,
      'Allen Solly Junior': 3,
      'Kookie Kids': 3,
      'Biba': 5
    };

    //Verify the Brands section heading
    cy.get(".brands_products>h2").should("contain","Brands");
    let foundBrands = [];
    cy.get("div.brands-name ul.nav-stacked li").each(($li)=>{
      //get brand name and count from list item
      const $anchor = $li.find('a');
      const $countSpan = $anchor.find('span.pull-right');

      //Extract the count number
      const expectedCount = parseInt($countSpan.text().replace(/[()]/g, ''), 10);

      // Extract brand name by removing count span content
      const brandName = $anchor.text()
        .replace($countSpan.text(), '')
        .trim();

      //Verify brand exists in expected list
      expect(expectedBrands,`Brand "${brandName}"should exist`).to.have.property(brandName);

      //Verify product count matches
      expect(expectedCount,`Count for ${brandName}`).to.equal(expectedBrands[brandName]);
      foundBrands.push(brandName);

    }).then(()=>{
      // Verify all expected brands were found
      expect(foundBrands).to.have.length(Object.keys(expectedBrands).length);
      expect(foundBrands).to.include.members(Object.keys(expectedBrands));
    }) 
  })

  it('Verify brand links', () => {
    cy.get('.brands-name a').each(($link) => {
      const href = $link.attr('href');
      cy.request(href).its('status').should('eq', 200);
    });
  });

  it("Verify features Items section", () => {
    const expectedProducts = [
      'Blue Top',
      'Men Tshirt',
      'Sleeveless Dress',
      'Stylish Dress',
      'Winter Top',
      'Summer White Top',
      'Madame Top For Women',
      'Fancy Green Top',
      'Sleeves Printed Top - White',
      'Half Sleeves Top Schiffli Detailing - Pink',
      'Frozen Tops For Kids',
      'Full Sleeves Top Cherry - Pink',
      'Printed Off Shoulder Top - White',
      'Sleeves Top and Short - Blue & Pink',
      'Little Girls Mr. Panda Shirt',
      'Sleeveless Unicorn Patch Gown - Pink',
      'Cotton Mull Embroidered Dress',
      'Blue Cotton Indie Mickey Dress',
      'Long Maxi Tulle Fancy Dress Up Outfits -Pink',
      'Sleeveless Unicorn Print Fit & Flare Net Dress - Multi',
      'Colour Blocked Shirt – Sky Blue',
      'Pure Cotton V-Neck T-Shirt',
      'Green Side Placket Detail T-Shirt',
      'Premium Polo T-Shirts',
      'Pure Cotton Neon Green Tshirt',
      'Soft Stretch Jeans',
      'Regular Fit Straight Jeans',
      'Grunt Blue Slim Fit Jeans',
      'Rose Pink Embroidered Maxi Dress',
      'Cotton Silk Hand Block Print Saree',
      'Rust Red Linen Saree',
      'Beautiful Peacock Blue Cotton Linen Saree',
      'Lace Top For Women',
      'GRAPHIC DESIGN MEN T SHIRT - BLUE'
    ];

    //verify the title of the section
    cy.get(".features_items h2.title").should("contain","Features Items");
    
    //Verify the count of products
    cy.get(".features_items .col-sm-4").should("have.length",expectedProducts.length);
    
    //Verify the products on feature pages
    cy.get("div .col-sm-9 .features_items .col-sm-4").each(($item,index)=>{
      cy.wrap($item)
      .find("div.productinfo p")
      .should("have.text",expectedProducts[index]);  
  });

  //Verify add a single item using overlay
  cy.get(".features_items .col-sm-4").first().within(()=>{

    //Trigger hover to show mouse overlay
    cy.get(".single-products").trigger("mouseover");

    // Click add to cart in overlay
    cy.get('.product-overlay .add-to-cart').click({force:true})
     
    
 });

 cy.get("div.features_items div#cartModal.show .modal-confirm .modal-content").should("be.visible").within(()=>{
  cy.get("p.text-center:nth-child(2)").click();
 });
 //click on checkout btn
 cy.get("#do_action div.container .col-sm-6 a.btn.check_out").contains("Proceed To Checkout").click();

 //Verify Checkout modal
 cy.get("#checkoutModal .modal-confirm").should("be.visible")
 .within(()=>{
  cy.get("p.text-center:nth-child(2)").click();
});
  
});

it.only("Register and login in the page",()=>{
  cy.visit("https://www.automationexercise.com/login");
  cy.get(".col-sm-4 .signup-form").within(()=>{
    cy.get("h2").contains("New User Signup!");
    cy.get('[data-qa="signup-name"]').should('have.attr', 'placeholder', 'Name').type("Demo");
    cy.get('[data-qa="signup-email"]').should("have.attr","placeholder", "Email Address").type("demog@yopmail.com");
    cy.get('[data-qa="signup-button"]').click();
  })
    cy.url().should('include', '/signup')
    cy.get(".login-form h2.title.text-center").contains("Enter Account Information");
    cy.get(".clearfix").find("label").contains("Title");
    cy.get('[data-qa="title"]#uniform-id_gender1').click();
    cy.get('[data-qa="password"]').type("demo123");
    cy.get('[data-qa="days"]').select(15).should("have.value","15");
    cy.get('[data-qa="months"]').select(5).should("have.value","5");
    cy.get('[data-qa="years"]').select(19).should("have.value","2003");
    cy.get(".checkbox #newsletter").check();
    cy.get('[data-qa="first_name"]').type("Dummy");
    cy.get('[data-qa="last_name"]').type("Demmo");
    cy.get('[data-qa="company"]').type("companny");
    cy.get('[data-qa="address"]').type("Kanpur");
    cy.get('[data-qa="address2"]').type("Mann");
    cy.get('[data-qa="state"]').type("Uttarpradesh");
    cy.get('[data-qa="city"]').type("Kanpur");
    cy.get('[data-qa="zipcode"]').type(209217);
    cy.get('[data-qa="mobile_number"]').type(9650817488);
    cy.get('[data-qa="create-account"]').click();
    cy.get(".col-sm-9").within(()=>{
      cy.get("h2").contains("Account Created!");
      cy.get(":nth-child(2)").contains("Congratulations! Your new account has been successfully created!");
      cy.get(":nth-child(3)").contains("You can now take advantage of member privileges to enhance your online shopping experience with us.");
      cy.get('[data-qa="continue-button"]').click();
    })
    
  })
})








        