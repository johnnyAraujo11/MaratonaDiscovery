const Modal = {
    open() {
        //Adicionar a classe modal à tag
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close() {
        //remover a classe modal da tag
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

//Armazenar informações no próprio navegador 
const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finance:transactions")) || [   ]
    },
    set(transactions){
        //Transformar em string todo o array de objeto(transactions), pois só poderá armazernar dessa forma
        localStorage.setItem("dev.finance:transactions", JSON.stringify(transactions))
    }
}

/**
 * Criando um array de objetos para podermos listar novas transações
 * Funciona o seguinte: pegar os dados do usuário ao digitar novas trasações
 */
// substituindo as informaçõe de transactions pelo localStorage onde ficará o array salvo com os dados
/*const transactions = [
    {
        description: "luz e água",
        amount: 200,
        date: 02/02/2021
    }
]
*/


const transactions = Storage.get()



/*
 *Criando um objeto para fazer a contas de 'Entrada' 'Saída' e 'Total' 
 */
const Transaction = {
    //usado como atalho do objeto transaction acima
    // usamos da seguinte forma ( Transacton.all)
    //all: transactions( removido )

    add(transaction) {
        transactions.push(transaction)
        App.reload()
    },
    remove(index) {
        transactions.splice(index, 1)
        App.reload()
    },
    incomes() {
        // Pegar todas as transações 
        let income = 0;
        transactions.forEach(transaction => {
            // verificar se é maior que zero
            if (transaction.amount > 0) {
                // somar as variável e retornar a variável
                income += transaction.amount;
            }
        })
        return income
    },

    expenses() {
        // Pegar todas as transações 
        let expense = 0;
        transactions.forEach(transaction => {
            // verificar se é menor que zero
            if (transaction.amount < 0) {
                // somar as variável e retornar a variável
                expense += transaction.amount;
            }
        })
        return expense
    },

    total() {
        // Pegar todas as transações 
        let total = 0;
        // somar income e expense
        total = Transaction.incomes() + Transaction.expenses()

        return total
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    //Resposável por criar o <tr></tr>
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        // Adicionar a classe estilizado no css de acordo com o valor, positivo ou negativo
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        const image = transaction.amount > 0 ? "./assets/income.svg" : "./assets/expense.svg"
        const amount = Utils.formatCurrency(transaction.amount)


        const html = `
            <td class="description">${transaction.description}</td>
            <td class=${CSSclass}>${amount} </td>
            <td class="date">${transaction.date}</td>
            <td><img onclick="Transaction.remove(${index})" src=${image} alt=""></td>
        `
        return html
    },

    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}


const Utils = {

    formatAmount(value){
        value = Number(value) * 100
        return value 
    }, 
    formatDate(date){
        //split() separa a string pelo "-" e retorna em um array
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    } ,
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        //Usando expressão regular
        value = String(value).replace(/\D/g, "")
        //usado para "retirar as duas casa decimais da entrada do usuário"
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

   
    saveTransaction(transaction){
        Transaction.add(transaction) 
    },
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    //Verificar se foram preenchidas todas as informações
    validateFields() {
        // Desestruturação
        const {
            description,
            amount,
            date
        } = Form.getValues()
       
        //trim() remove espaços de uma string 
        
        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Preencha todos os campos.")
        }
    },

    //formatar dados para salvar
    formatValues() {
        let {description, amount, date} = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        return { description, amount, date}
    },
    //limpar os campos do Modal
    clearFields(){
        this.description.value = ""
        this.amount.value = ""
        this.date.value = ""
    },
    //Ao clicar no botão 'salvar'
    submit(event) {
        //Para o form não enviar as informações junto à url
        event.preventDefault()
        try {
            Form.validateFields()
            const transaction =Form.formatValues()
            //salvar
            Form.saveTransaction(transaction)
            Form.clearFields()
            Modal.close()

        } catch (error) {
            alert(error.message)
        }
    },
    

    
    //apagar os dados do formulario
    //modal feche
    //atualizar a aplicação
}



const App = {
    init() {
        // Colocando cada transação no HTML
        transactions.forEach((transaction, index) => DOM.addTransaction(transaction, index))
        DOM.updateBalance()
        Storage.set(transactions)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}


App.init()

