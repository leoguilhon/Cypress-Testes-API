/// <reference types="cypress" />

describe('Login - Testes da API ServeRest', () => {
    it.only('Deve fazer login com sucesso', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/login',
            body: {
                "email": "leonardo_teste@qa.com.br",
                "password": "teste"
              }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Login realizado com sucesso')
            cy.log(response.body.authorization)
        })
    });
    
});