describe("Verify Contact us page",()=>{
    it("test contactus page",()=>{
        cy.visit("https://www.automationexercise.com/");
        cy.get('a[href="/contact_us"]').click();
       // cy.url().contains("/contact_us");
        cy.get("#contact-page").within(()=>{
            cy.get("h2").contains("Contact Us");
            cy.contains("Below contact form is for testing purpose.");
            cy.get(".contact-form h2").contains("Get In Touch");
            cy.get('[data-qa="name"]').type("Demo");
            cy.get('[data-qa="email"]').type("abc@yopmail.com");
            cy.get('[data-qa="subject"]').type("Testing");
            cy.get('[data-qa="message"]').type("jsa khdkaHDD LSAHDL BHDSNDLKD NLD NLHDLKASHhsjadnasl flkf fb hbamf kjagbma bkj abd,a sndkjbasm,a.");
            cy.get('input[name="upload_file"]').selectFile("C:\\Users\\erani\\Downloads\\AnitaPalResumeQA.pdf",{action: "drag-drop"});
            cy.get('[data-qa="submit-button"]').click();
            cy.get(".alert-success").contains("Success! Your details have been submitted successfully.");
        })


        //Verify email subscription
        cy.get(".searchform").within(() => {
            
          
            // Fill and submit form
            cy.get("#susbscribe_email")
              .type("ani1@yopmail.com");
            cy.get("#subscribe").click();
          
            // Verify alert
            cy.on('window:alert',(t)=>{
                //assertions
                expect(t).to.contains('Success! Your details have been submitted successfully.');
             })

    })

    

    
})
})