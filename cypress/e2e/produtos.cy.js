/// <reference types="cypress" />

import contrato from "../contracts/produtos.contract";

describe('Teste da Funcionalidade Produtos', () => {
    let token
    before(() => {
        cy.token('leonardo_teste@qa.com.br', 'teste').then(tkn => { token = tkn})
    });
    it('Deve validar contrato de produtos', () => {
        cy.request('produtos').then(response => {
            return contrato.validateAsync(response.body)
        })
    });
    
    it('Listar produtos', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).then(response => {
            //expect(response.body.produtos[13].nome).to.equal('Logitech MX Vertical')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(15)
        })
    });

    it('Cadastrar produto', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 1000000)}`
        cy.request({
            method: 'POST',
            url: 'produtos',
            body: {
                "nome": produto,
                "preco": 100,
                "descricao": "Produto Novo",
                "quantidade": 500
              },
              headers: {authorization: token}
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    });
    it('Deve validar mensagem de erro ao tentar cadastrar produto com nome repetido', () => {
        cy.cadastrarProduto(token, 'Produto EBAC Novo', 250, 'Descrição do produto novo', 180)
        .then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Já existe produto com esse nome')
        })
    });
    it('Deve editar um produto cadastrado', () => {
        cy.request('produtos').then(response => {
            let produto = `Produto editado ${Math.floor(Math.random() * 1000000)}`
            let id = response.body.produtos[0]._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: {authorization: token},
                body: {
                    "nome": produto,
                    "preco": 100,
                    "descricao": "Editado",
                    "quantidade": 150
                  }
            }).then(response => {
                expect(response.body.message).to.equal("Registro alterado com sucesso")
            })
        })
    });
    it('Deve editar um produto cadastrado previamente', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 1000000)}`
        cy.cadastrarProduto(token, produto, 250, 'Descrição do produto novo', 180).then(response => {
            let id = response.body._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: {authorization: token},
                body: {
                    "nome": produto,
                    "preco": 100,
                    "descricao": "Editado",
                    "quantidade": 150
                  }
            }).then(response => {
                expect(response.body.message).to.equal("Registro alterado com sucesso")
            })
        })
    });
    it('Deve deletar um produto previamente cadastrado', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 1000000)}`
        cy.cadastrarProduto(token, produto, 250, 'Descrição do produto novo', 180)
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `produtos/${id}`,
                headers: {authorization: token}
            }).then(response => {
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
            })
        })
    });
});