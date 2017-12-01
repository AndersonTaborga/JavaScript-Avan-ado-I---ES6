class NegociacaoController {

    constructor() {
        //Passar essa manipulação da DOM para o constructor é performático e possibilita o conceito de cache
        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView($('#negociacoesView')),
            'adiciona', 'esvazia');

        this._mensagem = new Bind(
            new Mensagem(), new MensagemView($('#mensagemView')),
            'texto');

        ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .then(negociacoes => negociacoes.forEach(negociacao =>
                this._listaNegociacoes.adiciona(negociacao)))
            .catch(error => {
                console.log(erro);
                this._mensagem.texto = erro;
            });

    }

    adiciona(event) {

        event.preventDefault();

        ConnectionFactory
            .getConnection()
            .then(connection => {

                let negociacao = this._criaNegociacao();

                new NegociacaoDao(connection)
                    .adiciona(negociacao)
                    .then(() => {

                        this._listaNegociacoes.adiciona(negociacao);

                        this._mensagem.texto = 'Negociação adicionada com sucesso';

                        this._limpaFormulario();

                    })

            })
            .catch(erro => this._mensagem.texto = erro);

    }

    importaNegociacoes() {

        let service = new NegociacaoService();

        service
        .obterNegociacoes()
        .then(negociacoes => {
            negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
            this._mensagem.texto = 'Negociações do período importadas com sucesso';
        })
        .cath(erro => this._mensagem.texto = erro);
    }

    apaga() {

        ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(mensagem => {
                this._mensagem.texto = mensagem;
                this._listaNegociacoes.esvazia();
            });

    }

    _criaNegociacao() {

        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value));

    }

    _limpaFormulario() {

        this._inputData.value = '';

        this._inputQuantidade.value = 1;

        this._inputValor.value = 0.0;

        this._inputData.focus();

    }
}