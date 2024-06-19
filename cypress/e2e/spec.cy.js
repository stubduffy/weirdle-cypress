function makeGuess(input)  {
  cy.findByRole('textbox').type(input)
  cy.findByRole('button', { name: 'Submit'}).click()
}

function checkRowWithIndex(index, guess) {
  cy.get('tbody').within(() => {
    cy.get('tr').eq(index).within(() => {
        cy.get('td').eq(0).contains(`Guess${index+1}`)
        for (const column of [0,1,2,3,4]) {
            cy.get('td').eq(column+1).contains(guess[column])
        }
    })
  })
}

describe('weirdle', () => {
  it.only('shows a patronising message when user loses', () => {
    cy.visit('/')

    cy.fixture('guesses').then(($guesses) => {
      for (const i of [0,1,2,3,4,5]) {
        const guess = $guesses[i]
        makeGuess(guess)
        checkRowWithIndex(i, guess)
      }
    })

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

    cy.fixture('guesses').then(($guesses) => {
      // we'll win on the 5th guess
      for (const i of [0,1,2,3,4]) {
        const guess = $guesses[i]
        makeGuess(guess)
        checkRowWithIndex(i, guess)
      }
    })

    cy.get('#remarks').contains('Hooray')

    cy.get('a').click()
    cy.origin('www.oed.com', () => {
      cy.location('hostname').should('eq', 'www.oed.com')
      cy.contains('puppy')
    })
    
  })
})