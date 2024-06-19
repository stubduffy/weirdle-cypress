function makeGuess(input)  {
  cy.findByRole('textbox').type(input)
  cy.findByRole('button', { name: 'Submit'}).click()
}

describe('weirdle', () => {
  it.only('shows a patronising message when user loses', () => {
    cy.visit('/')

    cy.location('hostname').should('eq', 'stubduffy.github.io')

    cy.fixture('guesses').each(($guess) => {
      makeGuess($guess)
    })

    for (let i =0; i <= 5; i++) {
      cy.get('tbody').within(() => {
        cy.get('tr').eq(i).within(() => {
            cy.get('td').eq(0).contains(`Guess${i+1}`)
        })
      })
    }

    cy.get('#remarks').contains('Sorry')

    cy.get('a').click()
    cy.origin('www.oed.com', () => {
      cy.location('hostname').should('eq', 'www.oed.com')
    })
    
  })

  it.only('is nice and encouraging when user wins', () => {
    cy.wrap(Cypress.automation('remote:debugger:protocol', {
      command: 'Network.clearBrowserCache',
    }))
    cy.intercept('**/weirdle.js', 
      (req) => {    
       req.continue((res) => {
         res.body = res.body.replace(/initial_words = \[\"[^\]]*\]/g, "initial_words = \[\"geeks\", \"tooth\", \"gates\", \"dread\", \"puppy\", \"limes\", \"beard\"]")
         return res
       })
     })

    cy.visit('/')

    cy.location('hostname').should('eq', 'stubduffy.github.io')

    cy.fixture('guesses').then(($guesses) => {
      // we'll win on the 5th guess so only try that many
      for (const guess of $guesses.slice(0, 5)) {
        makeGuess(guess)
      }
    })

    for (let i =0; i <= 4; i++) {
      cy.get('tbody').within(() => {
        cy.get('tr').eq(i).within(() => {
            cy.get('td').eq(0).contains(`Guess${i+1}`)
        })
      })
    }

    cy.get('#remarks').contains('Hooray')

    cy.get('a').click()
    cy.origin('www.oed.com', () => {
      cy.location('hostname').should('eq', 'www.oed.com')
    })
    
  })
})