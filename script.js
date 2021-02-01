const Modal = {
    open(){
        //Adicionar a classe modal à tag
        document
        .querySelector('.modal-overlay')
        .classList
        .add('active')
    },
    close(){
        //remover a classe modal da tag
        document
        .querySelector('.modal-overlay')
        .classList
        .remove('active')
    }
}
