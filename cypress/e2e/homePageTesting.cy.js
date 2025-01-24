describe("homepage verification",()=>{
    beforeEach(()=>{
        cy.visit("https://www.automationexercise.com/");
        cy.url().should('eq',"https://www.automationexercise.com/");
    });

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

    it("Verify the content of all carousel slides",()=>{
        //verify the number of slides
        cy.get('#slider-carousel>.carousel-inner>.item').then((slides)=>{
            const totalNoOfSlides = slides.length;
            cy.log(`Total slides found: ${totalNoOfSlides}`);
            expect(totalNoOfSlides).to.be.greaterThan(0);
            //loop through all the slides
            for(let i=0;i<totalNoOfSlides;i++){
                cy.get(`.carousel-indicators li[data-slide-to="${i}"`).click();
                cy.wait(1000)//wait for transition to complete 
                cy.get(".carousel-indicators li[data-slide-to].active").eq(i).should("have.class","active");
                //verify slides content(static and dynamic elements)

                cy.get(".carousel-indicators li[data-slide-to]").eq(i).within(()=>{
                    cy.get("h1").should("exist").and("be.visible").and("have.text","Automation Exercise");
                })
            }
           
        })
    })

})