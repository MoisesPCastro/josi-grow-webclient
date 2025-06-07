<!DOCTYPE html >
    <html lang="pt-BR" >
        <head>
        <meta charset="UTF-8" />
            <meta name="viewport" content = "width=device-width, initial-scale=1.0" />
                <title>Loja da dona maria do Tutu </title>
                    < link rel = "stylesheet" href = "style.css" />
                        <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" rel = "stylesheet" >
                            <!--SweetAlert2 CSS-- >
                                <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel = "stylesheet" >
                                    <!--SweetAlert2 JS-- >
                                        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" > </script>
                                            </head>
                                            < body >
                                            <header>
                                            <h1>Teste </h1>
                                            </header>

                                            < main >
                                            </>


                                            < footer >
                                            <p>& copy; 2025 Loja da dona maria do Tutu </p>
                                                </>

                                                < !--Carregue o Axios antes do seu script-- >
                                                    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js" > </script>
                                                        <script>

function registraPedido(payload) {
    // Enviar requisição para a API com axios

    axios.post('https://lojadadonamariadotutu.net.br/api/cadastra', payload, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log('Pedido registrado com sucesso:', response.data);
        })
        .catch(error => {
            console.error('Erro ao registrar pedido na API:', error);
        });
}

const nome = 'Tutu';
const telefone = '31988261619';
let cesta = {
    "File de Tilapia": {
        "id": 1,
        "produto": "File de Tilapia",
        "idloja": 1,
        "idcategoria": 4,
        "idunidade": 3,
        "preco": 30,
        "imagem": "file-tilapia.jpeg",
        "status": 1,
        "unidade": "Bandeja",
        "categoria": "Peixes",
        "nome": "Food",
        "quantidade": 2
    },
    "Cabaçinha de queijo": {
        "id": 4,
        "produto": "Cabaçinha de queijo",
        "idloja": 1,
        "idcategoria": 1,
        "idunidade": 2,
        "preco": 30,
        "imagem": "cabaca.jpeg",
        "status": 1,
        "unidade": "Unidade",
        "categoria": "Laticinios",
        "nome": "Food",
        "quantidade": 1
    }
}
// Monta o resumo e envia pelo WhatsApp
let mensagem = `🛒 *Novo Pedido *%0A`;
mensagem += `👤 *Cliente:* ${nome}%0A📞 *Telefone:* ${telefone}%0A`;
mensagem += `%0A📦 *Resumo do Pedido:*%0A`;

let total = 0;
let produtos = [];
Object.entries(cesta).forEach(([nomeProduto, item]) => {
    produtos.push({ idproduto: item.id, quantidade: item.quantidade, valor: item.preco.toFixed(2) });
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    mensagem += `• ${item.quantidade}x ${nomeProduto} - R$ ${subtotal.toFixed(2).replace('.', ',')}%0A`;
});

const payload = {
    nome,
    telefone,
    produtos
};
//Envia para api
//registraPedido(payload);

mensagem += `%0A💰 *Total:* R$ ${total.toFixed(2).replace('.', ',')}`;

const numeroLoja = "5531997853349"; // Altere para seu número
const link = `https://wa.me/${numeroLoja}?text=${mensagem}`;
window.open(link, "_blank");
</script>
    </body>
    </html>
